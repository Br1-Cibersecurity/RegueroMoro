// index.js
const express = require('express');
const path = require('path');
const { CARTA_REAL } = require('./src/productos');
const { ordenarComanda, formatearTicket } = require('./src/logica');

const app = express();
const PORT = 3000;

app.use(express.json());

// ¡ESTA LÍNEA ES CLAVE! Conecta tu carpeta public con el navegador
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/carta', (req, res) => {
    res.json(CARTA_REAL);
});

app.post('/api/comanda', (req, res) => {
    const { mesa, personas, pedido } = req.body;
    const pedidoOrdenado = ordenarComanda(pedido);
    const textoTicket = formatearTicket(pedidoOrdenado, mesa, personas);
    
    console.log("\n--- NUEVA COMANDA RECIBIDA ---");
    console.log(textoTicket);
    
    res.status(200).send({ mensaje: "Comanda enviada" });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});