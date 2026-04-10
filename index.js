const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

const PATH_CARTA = path.join(__dirname, 'carta.json');
const PATH_CAJA = path.join(__dirname, 'caja.json');
const PATH_MESAS_VIVAS = path.join(__dirname, 'mesas_activas.json');
const PATH_TURNO = path.join(__dirname, 'estado_turno.json');
const DIR_HISTORIAL = path.join(__dirname, 'historial');
const PATH_MENUS_HISTORIAL = path.join(__dirname, 'historial_menus_diarios.json');

// 1. Blindaje y creación de archivos
if (!fs.existsSync(DIR_HISTORIAL)) fs.mkdirSync(DIR_HISTORIAL);
[PATH_CAJA, PATH_MESAS_VIVAS, PATH_TURNO, PATH_MENUS_HISTORIAL].forEach(ruta => {
    if (!fs.existsSync(ruta)) fs.writeFileSync(ruta, JSON.stringify(ruta === PATH_TURNO ? { activo: false } : [], null, 2));
});

// 2. CARGA INTELIGENTE DE CARTA: Forzamos la lectura de tu archivo productos.js
const cargarCartaInicial = () => {
    try {
        const prod = require('./src/productos').CARTA_REAL;
        if (prod && Object.keys(prod).length > 0) return prod;
    } catch (e) {
        console.error("No se pudo leer ./src/productos.js");
    }
    // Salvavidas mínimo si productos.js no existe
    return {
        "MENUS": [
            { "nombre": "Menú Diario", "precio": 20.00 },
            { "nombre": "Menu carnivoro", "precio": 78.00 },
            { "nombre": "Menu Paletilla", "precio": 78.00 },
            { "nombre": "Menu del Mar", "precio": 78.00 },
            { "nombre": "CALSOTADA", "precio": 76.00 },
            { "nombre": "Menu Infantil", "precio": 15.00 }
        ]
    };
};

if (!fs.existsSync(PATH_CARTA)) {
    fs.writeFileSync(PATH_CARTA, JSON.stringify(cargarCartaInicial(), null, 2));
} else {
    // REPARACIÓN: Si el archivo carta.json se quedó guardado como "{}" por error, lo reparamos
    try {
        const cartaActual = JSON.parse(fs.readFileSync(PATH_CARTA, 'utf8'));
        if (Object.keys(cartaActual).length === 0) {
            fs.writeFileSync(PATH_CARTA, JSON.stringify(cargarCartaInicial(), null, 2));
        }
    } catch(e) {
        fs.writeFileSync(PATH_CARTA, JSON.stringify(cargarCartaInicial(), null, 2));
    }
}

let registroComandasTurno = []; 
let cartaVersion = Date.now(); // Control de sincronización instantánea en tablets

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const leerDB = (ruta) => { try { return JSON.parse(fs.readFileSync(ruta, 'utf8')); } catch (e) { return ruta === PATH_TURNO ? { activo: false } : (ruta === PATH_CARTA ? {} : []); } };
const escribirDB = (ruta, datos) => { fs.writeFileSync(ruta, JSON.stringify(datos, null, 2)); };

// --- APIS DE CARTA DINÁMICA ---
app.get('/api/carta', (req, res) => res.json(leerDB(PATH_CARTA)));
app.post('/api/carta/actualizar', (req, res) => {
    escribirDB(PATH_CARTA, req.body);
    cartaVersion = Date.now(); // Dispara la recarga en todas las tablets al instante
    res.json({ success: true });
});

// --- APIS DE MENÚ DIARIO SEMANAL (Con soporte para Edición y Borrado) ---
app.get('/api/maestro/menus-diarios', (req, res) => res.json(leerDB(PATH_MENUS_HISTORIAL)));

app.post('/api/maestro/menus-diarios', (req, res) => {
    let historial = leerDB(PATH_MENUS_HISTORIAL);
    if(!Array.isArray(historial)) historial = [];
    
    const { id, inicio, fin, primero, segundo, postre } = req.body;
    
    if (id) {
        const idx = historial.findIndex(m => m.id === id);
        if(idx !== -1) historial[idx] = { id, inicio, fin, primero, segundo, postre };
    } else {
        historial.unshift({ id: Date.now().toString(), inicio, fin, primero, segundo, postre });
        if (historial.length > 5) historial = historial.slice(0, 5);
    }
    
    escribirDB(PATH_MENUS_HISTORIAL, historial);
    res.json({ success: true });
});

app.post('/api/maestro/menus-diarios/eliminar', (req, res) => {
    let historial = leerDB(PATH_MENUS_HISTORIAL);
    historial = historial.filter(m => m.id !== req.body.id);
    escribirDB(PATH_MENUS_HISTORIAL, historial);
    res.json({ success: true });
});

// --- APIS MAESTRO (Turnos y Estado) ---
app.get('/api/maestro/status', (req, res) => {
    res.json({ 
        turno: leerDB(PATH_TURNO), 
        mesasVivas: leerDB(PATH_MESAS_VIVAS), 
        historial: leerDB(PATH_CAJA),
        comandas: registroComandasTurno,
        cartaVersion: cartaVersion
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

// --- LÓGICA DE IMPRESIÓN Y DESGLOSE A COCINA ---
const DESGLOSE_ESTATICO = {
    "carnivoro": ["Embutidos", "Ensalada R.", "Lomo bajo"],
    "paletilla": ["Ensalada R.", "Gambones al ajillo", "Paletilla"],
    "mar": ["Carpaccio de Bacalao", "Tentáculo", "Lubina"],
    "calsotada": ["Embutido", "Teja"]
};

app.post('/api/imprimir/comanda', (req, res) => {
    const { mesa, pax, pedidoNuevos, camarero } = req.body;
    const ahora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    
    // Filtro estricto: Todo lo que sea postre, café, helado, tarta o botella NO SE IMPRIME EN COCINA
    const pedidoFiltrado = pedidoNuevos.filter(p => {
        const n = p.nombre.toLowerCase();
        return !n.includes("postre") && !n.includes("cafe") && !n.includes("infusion") && !n.includes("helado") && !n.includes("tarta") && !n.includes("botella");
    });

    if (pedidoFiltrado.length === 0) return res.json({ success: true });

    let lineasFinales = [];

    pedidoFiltrado.forEach(p => {
        const nNorm = p.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        // El Menú Infantil no lleva desglose.
        if (nNorm.includes("infantil")) {
            lineasFinales.push(`1x ** ${p.nombre.toUpperCase()} **`);
            lineasFinales.push(` `); // Espacio separador visual extra
            return;
        }

        // --- FORMATO ESCALONADO PARA COCINA ---
        
        // Extracción de modificadores (Puntos de carne, etc.)
        let tituloPrincipal = p.nombre.split(' [')[0].toUpperCase(); // Quitamos los corchetes del título base
        let extrasMatch = p.nombre.match(/\[Punto.*?\]/gi);
        let textoExtra = extrasMatch ? ` ${extrasMatch.join(' ')}` : "";
        
        // Imprime el nombre del plato GRANDE/Destacado (Sin nombre de camarero)
        lineasFinales.push(`1x ** ${tituloPrincipal}${textoExtra} **`);

        // Desglose de Teja Add / Extra (Producto suelto, no menú)
        if (nNorm.includes("teja")) {
            lineasFinales.push(` `); // Espacio separador visual extra
            return;
        }

        // Desglose Estático para Carnívoro, Paletilla, Mar y base de Calçotada
        if (!nNorm.includes("diario")) {
            const key = Object.keys(DESGLOSE_ESTATICO).find(k => nNorm.includes(k));
            if (key) {
                DESGLOSE_ESTATICO[key].forEach(sub => {
                    // Si el subplato es Lomo Bajo, le pegamos el punto de carne si existe
                    if (sub === "Lomo bajo" && textoExtra) {
                        lineasFinales.push(`   - ${sub} ${textoExtra}`);
                    } else {
                        lineasFinales.push(`   - ${sub}`);
                    }
                });
            }
        }
        
        // Desglose de Opciones Variables (1º y 2º del Menú Diario, o 2º de la Calçotada)
        const m1 = p.nombre.match(/\[1º: (.*?)\]/);
        const m2 = p.nombre.match(/\[2º: (.*?)\]/);
        
        if (m1) lineasFinales.push(`   - 1º: ${m1[1]}`);
        if (m2) lineasFinales.push(`   - 2º: ${m2[1]}`);
        
        lineasFinales.push(` `); // Espacio separador visual extra entre platos diferentes
    });

    // Añadimos un espacio generoso en blanco al final del ticket para escribir
    lineasFinales.push('<br><br><br>');

    // Aquí guardamos la comanda entera con el camarero global que pulsó PEDIR
    registroComandasTurno.unshift({ mesa, pax, camarero, ahora, productos: lineasFinales });
    res.json({ success: true });
});

// --- GESTIÓN DE MESAS Y CAJA ---
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

app.listen(PORT, () => console.log(`🚀 Servidor Reguero Moro Pro en puerto ${PORT}`));