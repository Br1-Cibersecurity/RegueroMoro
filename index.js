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

if (!fs.existsSync(DIR_HISTORIAL)) fs.mkdirSync(DIR_HISTORIAL);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const obtenerEstadoTurno = () => {
    try {
        if (!fs.existsSync(PATH_TURNO)) return { activo: false, inicio: null };
        return JSON.parse(fs.readFileSync(PATH_TURNO, 'utf8'));
    } catch (e) { return { activo: false, inicio: null }; }
};

const leerDB = (ruta) => {
    try {
        if (!fs.existsSync(ruta)) return [];
        return JSON.parse(fs.readFileSync(ruta, 'utf8'));
    } catch (e) { return []; }
};

const escribirDB = (ruta, datos) => {
    fs.writeFileSync(ruta, JSON.stringify(datos, null, 2));
};

const purgarHistorialAntiguo = () => {
    try {
        const archivos = fs.readdirSync(DIR_HISTORIAL);
        const ahora = Date.now();
        const sieteDiasMs = 7 * 24 * 60 * 60 * 1000;
        archivos.forEach(archivo => {
            const rutaArchivo = path.join(DIR_HISTORIAL, archivo);
            const stats = fs.statSync(rutaArchivo);
            if (ahora - stats.mtimeMs > sieteDiasMs) fs.unlinkSync(rutaArchivo);
        });
    } catch (e) { console.error("Error purgando historial"); }
};

app.get('/api/maestro/historial-archivos', (req, res) => {
    try {
        const archivos = fs.readdirSync(DIR_HISTORIAL).filter(f => f.endsWith('.json')).map(f => ({ id: f, fecha: fs.statSync(path.join(DIR_HISTORIAL, f)).mtime })).sort((a, b) => b.fecha - a.fecha);
        res.json(archivos);
    } catch(e) { res.json([]); }
});

app.get('/api/maestro/historial-detalle/:archivo', (req, res) => {
    try { res.json(JSON.parse(fs.readFileSync(path.join(DIR_HISTORIAL, req.params.archivo), 'utf8'))); } 
    catch (e) { res.status(404).send("Archivo no encontrado"); }
});

app.get('/api/turno/estado', (req, res) => res.json(obtenerEstadoTurno()));

app.post('/api/turno/estado', (req, res) => {
    const { activo } = req.body;
    const estadoActual = obtenerEstadoTurno();
    if (estadoActual.activo && !activo) {
        const datosTurno = { resumenCaja: leerDB(PATH_CAJA), mesasVivasAlCierre: leerDB(PATH_MESAS_VIVAS), inicio: estadoActual.inicio, fin: new Date().toISOString() };
        const nombreArchivo = `turno_${new Date().toISOString().replace(/:/g, '-')}.json`;
        escribirDB(path.join(DIR_HISTORIAL, nombreArchivo), datosTurno);
        escribirDB(PATH_CAJA, []);
        escribirDB(PATH_MESAS_VIVAS, []);
        purgarHistorialAntiguo();
    }
    const nuevoEstado = { activo, inicio: activo ? (estadoActual.inicio || new Date().toISOString()) : null };
    escribirDB(PATH_TURNO, nuevoEstado);
    res.json({ success: true, ...nuevoEstado });
});

app.get('/api/carta', (req, res) => res.json(CARTA_REAL));
app.get('/api/mesas/activas', (req, res) => res.json(leerDB(PATH_MESAS_VIVAS)));

app.post('/api/mesas/actualizar', (req, res) => {
    const estado = obtenerEstadoTurno();
    if (!estado.activo) return res.status(403).json({ error: "TURNO CERRADO" });
    const { mesa, pedido, camarero, operacion, pax } = req.body;
    let mesasVivas = leerDB(PATH_MESAS_VIVAS);
    let idx = mesasVivas.findIndex(m => m.id === mesa);

    if (idx === -1) {
        mesasVivas.push({ id: mesa, pax: pax || 1, pedido: pedido || [], iniciadoPor: camarero, ultimaMod: camarero, timestamp: new Date().toISOString(), estadoInterno: 'abierta' });
    } else {
        if (operacion === 'borrar' || operacion === 'sobrescribir') {
            mesasVivas[idx].pedido = pedido;
        } else {
            const idsExistentes = new Set(mesasVivas[idx].pedido.map(p => p.idUnico));
            const nuevosItems = pedido.filter(p => !idsExistentes.has(p.idUnico));
            mesasVivas[idx].pedido = [...mesasVivas[idx].pedido, ...nuevosItems];
        }
        mesasVivas[idx].ultimaMod = camarero;
        mesasVivas[idx].estadoInterno = 'abierta';
    }
    escribirDB(PATH_MESAS_VIVAS, mesasVivas);
    res.json({ success: true, pedidoActualizado: mesasVivas.find(m => m.id === mesa).pedido });
});

app.post('/api/caja/cierre', (req, res) => {
    const { mesa, total, metodo, propina, camarero, pedido } = req.body;
    let caja = leerDB(PATH_CAJA);
    let mesasVivas = leerDB(PATH_MESAS_VIVAS);
    const mesaInfo = mesasVivas.find(m => m.id === mesa);

    caja.push({ mesa, total, metodo, propina, cobradoPor: camarero, iniciadoPor: mesaInfo ? mesaInfo.iniciadoPor : camarero, pedido, timestamp: new Date().toISOString() });
    escribirDB(PATH_CAJA, caja);

    // CAMBIO: No borramos, marcamos como cobrada para el semáforo global
    let idx = mesasVivas.findIndex(m => m.id === mesa);
    if (idx !== -1) {
        mesasVivas[idx].estadoInterno = 'cobrada';
        mesasVivas[idx].ultimaMod = 'COBRADA';
        mesasVivas[idx].pedido = pedido; // Aseguramos que la propina se guarda
    }
    escribirDB(PATH_MESAS_VIVAS, mesasVivas);
    res.json({ success: true });
});

// NUEVA RUTA PARA DOBLAR
app.post('/api/mesas/doblar', (req, res) => {
    const { mesa } = req.body;
    let mesasVivas = leerDB(PATH_MESAS_VIVAS);
    mesasVivas = mesasVivas.filter(m => m.id !== mesa);
    escribirDB(PATH_MESAS_VIVAS, mesasVivas);
    res.json({ success: true });
});

app.get('/api/maestro/status', (req, res) => res.json({ turno: obtenerEstadoTurno(), mesasVivas: leerDB(PATH_MESAS_VIVAS), historial: leerDB(PATH_CAJA) }));

app.listen(PORT, () => console.log(`🚀 Servidor Reguero Moro Pro en http://localhost:${PORT}`));