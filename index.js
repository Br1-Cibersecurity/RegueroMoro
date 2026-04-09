const express = require('express');
const path = require('path');
const fs = require('fs');
const { CARTA_REAL } = require('./src/productos');

const app = express();
const PORT = 3000;

const PATH_CAJA = path.join(__dirname, 'caja.json');
const PATH_MESAS_VIVAS = path.join(__dirname, 'mesas_activas.json');
const PATH_TURNO = path.join(__dirname, 'estado_turno.json');
const DIR_HISTORIAL = path.join(__dirname, 'historial');
const PATH_MENUS_HISTORIAL = path.join(__dirname, 'historial_menus_diarios.json');

// Blindaje inicial: Crea los archivos si no existen sin pisarlos
if (!fs.existsSync(DIR_HISTORIAL)) fs.mkdirSync(DIR_HISTORIAL);
[PATH_CAJA, PATH_MESAS_VIVAS, PATH_TURNO, PATH_MENUS_HISTORIAL].forEach(ruta => {
    if (!fs.existsSync(ruta)) fs.writeFileSync(ruta, JSON.stringify(ruta === PATH_TURNO ? { activo: false } : [], null, 2));
});

let registroComandasTurno = []; 

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const leerDB = (ruta) => { try { return JSON.parse(fs.readFileSync(ruta, 'utf8')); } catch (e) { return ruta === PATH_TURNO ? { activo: false } : []; } };
const escribirDB = (ruta, datos) => { fs.writeFileSync(ruta, JSON.stringify(datos, null, 2)); };

// --- LÓGICA MENÚ DIARIO ---
app.get('/api/maestro/menus-diarios', (req, res) => res.json(leerDB(PATH_MENUS_HISTORIAL)));
app.post('/api/maestro/menus-diarios', (req, res) => {
    let historial = leerDB(PATH_MENUS_HISTORIAL);
    if(!Array.isArray(historial)) historial = [];
    historial.unshift(req.body);
    escribirDB(PATH_MENUS_HISTORIAL, historial);
    res.json({ success: true });
});

// Desglose de menús fijos
const DESGLOSE_ESTATICO = {
    "Menu carnivoro": ["Tabla Embutidos", "Ensalada Reguero", "Lomo Bajo Vacuno", "Bebida"],
    "Menu Paletilla": ["Ensalada Reguero", "Gambones Ajillo", "Paletilla Cordero", "Bebida"],
    "Menu del Mar": ["Carpaccio Bacalao", "Pulpo Brasa", "Pescado Horno", "Bebida"],
    "Menu Infantil": ["PLATO ÚNICO: Macarrones + Nuggets + Patatas"]
};

// --- APIS MAESTRO ---
app.get('/api/maestro/status', (req, res) => {
    res.json({ 
        turno: leerDB(PATH_TURNO), 
        mesasVivas: leerDB(PATH_MESAS_VIVAS), 
        historial: leerDB(PATH_CAJA),
        comandas: registroComandasTurno 
    });
});

app.post('/api/turno/estado', (req, res) => {
    const { activo } = req.body;
    const estadoActual = leerDB(PATH_TURNO);
    if (estadoActual.activo && !activo) {
        const datosTurno = { resumenCaja: leerDB(PATH_CAJA), mesasVivasAlCierre: leerDB(PATH_MESAS_VIVAS), fin: new Date().toISOString() };
        escribirDB(path.join(DIR_HISTORIAL, `turno_${new Date().toISOString().replace(/:/g, '-')}.json`), datosTurno);
        escribirDB(PATH_CAJA, []); 
        escribirDB(PATH_MESAS_VIVAS, []);
        registroComandasTurno = []; 
    }
    escribirDB(PATH_TURNO, { activo, inicio: activo ? new Date().toISOString() : null });
    res.json({ success: true });
});

app.get('/api/maestro/historial-archivos', (req, res) => {
    try {
        const archivos = fs.readdirSync(DIR_HISTORIAL).filter(f => f.endsWith('.json')).map(f => ({ id: f, fecha: fs.statSync(path.join(DIR_HISTORIAL, f)).mtime })).sort((a, b) => b.fecha - a.fecha);
        res.json(archivos);
    } catch(e) { res.json([]); }
});

app.get('/api/maestro/historial-detalle/:archivo', (req, res) => {
    try { res.json(JSON.parse(fs.readFileSync(path.join(DIR_HISTORIAL, req.params.archivo), 'utf8'))); } 
    catch (e) { res.status(404).send("Error al leer archivo"); }
});

// --- APIS CAMARERO ---
app.post('/api/imprimir/comanda', (req, res) => {
    const { mesa, pax, pedidoNuevos, camarero } = req.body;
    const ahora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    const pedidoFiltrado = pedidoNuevos.filter(p => {
        const n = p.nombre.toLowerCase();
        return !n.includes("postre") && !n.includes("cafe") && !n.includes("infusion") && !n.includes("helado") && !n.includes("tarta");
    });

    if (pedidoFiltrado.length === 0) return res.json({ success: true, msg: "Solo postres" });

    let lineasFinales = [];
    const menuDiarioActual = leerDB(PATH_MENUS_HISTORIAL)[0] || null;

    pedidoFiltrado.forEach(p => {
        const camareroProducto = p.camarero || camarero;
        lineasFinales.push(`1x ${p.nombre.toUpperCase()} (${camareroProducto})`);
        
        const nNorm = p.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        if (nNorm.includes("diario") && menuDiarioActual) {
            lineasFinales.push(`   > 1º: ${menuDiarioActual.primero}`);
            lineasFinales.push(`   > 2º: ${menuDiarioActual.segundo}`);
        } else {
            const key = Object.keys(DESGLOSE_ESTATICO).find(k => nNorm.includes(k.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));
            if (key) DESGLOSE_ESTATICO[key].forEach(sub => lineasFinales.push(`   > ${sub}`));
        }
    });

    registroComandasTurno.unshift({ mesa, pax, camarero, ahora, productos: lineasFinales });
    res.json({ success: true });
});

app.post('/api/mesas/actualizar', (req, res) => {
    const { mesa, pedido, camarero, pax, operacion } = req.body;
    let mesasVivas = leerDB(PATH_MESAS_VIVAS);
    let idx = mesasVivas.findIndex(m => m.id === mesa);

    if (idx === -1) {
        mesasVivas.push({ id: mesa, pax: pax || 1, pedido: pedido || [], iniciadoPor: camarero, ultimaMod: camarero, timestamp: new Date().toISOString(), estadoInterno: 'abierta' });
    } else {
        if (operacion === 'borrar' || operacion === 'sobrescribir') mesasVivas[idx].pedido = pedido;
        else mesasVivas[idx].pedido = [...mesasVivas[idx].pedido, ...pedido];
        mesasVivas[idx].ultimaMod = camarero;
    }
    escribirDB(PATH_MESAS_VIVAS, mesasVivas);
    res.json({ success: true });
});

app.post('/api/caja/cierre', (req, res) => {
    const { mesa, total, metodo, propina, camarero, pedido } = req.body;
    let caja = leerDB(PATH_CAJA), mesasVivas = leerDB(PATH_MESAS_VIVAS);
    caja.push({ mesa, total, metodo, propina, cobradoPor: camarero, pedido, timestamp: new Date().toISOString() });
    escribirDB(PATH_CAJA, caja);
    let idx = mesasVivas.findIndex(m => m.id === mesa);
    if (idx !== -1) { mesasVivas[idx].estadoInterno = 'cobrada'; mesasVivas[idx].ultimaMod = 'COBRADA'; mesasVivas[idx].pedido = pedido; }
    escribirDB(PATH_MESAS_VIVAS, mesasVivas);
    res.json({ success: true });
});

app.post('/api/mesas/doblar', (req, res) => {
    escribirDB(PATH_MESAS_VIVAS, leerDB(PATH_MESAS_VIVAS).filter(m => m.id !== req.body.mesa));
    res.json({ success: true });
});

app.get('/api/carta', (req, res) => res.json(CARTA_REAL));
app.listen(PORT, () => console.log(`🚀 Servidor Reguero Moro Pro en puerto ${PORT}`));