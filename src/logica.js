// src/logica.js

/**
 * Ordena una lista de productos según la prioridad establecida para El Reguero Moro:
 * 1: Infantil (Prioridad máxima)
 * 2: Menús (Carnívoro, Paletilla, Mar, Calsotada)
 * 3: Carta (Entrantes, Arroces, Pescados, Carnes)
 * 4: Sobremesa (Postres, Cafés, Chupitos)
 */
function ordenarComanda(lista) {
    if (!lista || !Array.isArray(lista)) return [];
    return [...lista].sort((a, b) => a.prioridad - b.prioridad);
}

/**
 * Filtra los productos que deben salir en el primer ticket (Comanda Inicial).
 * Incluye todo lo que NO sea postre o café (Prioridades 1, 2 y 3).
 */
function obtenerComandaCocina(lista) {
    if (!lista || !Array.isArray(lista)) return [];
    return lista.filter(item => item.prioridad >= 1 && item.prioridad <= 3);
}

/**
 * Filtra los productos para el segundo pase o servicios adicionales.
 * Incluye Postres y todo lo relacionado con la sobremesa (Prioridad 4).
 */
function obtenerComandaSobremesa(lista) {
    if (!lista || !Array.isArray(lista)) return [];
    return lista.filter(item => item.prioridad === 4);
}

/**
 * Calcula el total acumulado de la mesa para el PC Maestro.
 * Suma todos los items registrados independientemente de si se han impreso o no.
 */
function calcularTotalMesa(lista) {
    if (!lista || !Array.isArray(lista)) return 0;
    return lista.reduce((total, item) => total + (item.precio || 0), 0);
}

/**
 * Formatea el texto para la Xprinter (Simulación).
 * Añade los saltos de línea y el diseño básico para que sea legible.
 */
function formatearTicket(lista, mesa, pax) {
    if (lista.length === 0) return "";
    
    let ticket = `      EL REGUERO MORO\n`;
    ticket += `--------------------------------\n`;
    ticket += ` MESA: ${mesa}      PAX: ${pax}\n`;
    ticket += `--------------------------------\n`;
    
    const listaOrdenada = ordenarComanda(lista);
    
    listaOrdenada.forEach(item => {
        // Formato: Cantidad x Nombre (Alineado a la izquierda)
        ticket += `1 x ${item.nombre.padEnd(20)}\n`;
    });
    
    ticket += `--------------------------------\n`;
    ticket += `   GRACIAS POR SU VISITA\n\n\n`; // Espacio para el corte
    
    return ticket;
}

module.exports = { 
    ordenarComanda, 
    obtenerComandaCocina, 
    obtenerComandaSobremesa,
    calcularTotalMesa,
    formatearTicket
};