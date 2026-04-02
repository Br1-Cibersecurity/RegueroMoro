// specs/flujo.spec.js
const { obtenerComandaCocina, obtenerComandaSobremesa } = require('../src/logica');

const mesaPrueba = [
    { nombre: "Entsa. Regue", prioridad: 3 }, // Comida
    { nombre: "Infantil", prioridad: 1 },    // Comida
    { nombre: "Crema Cat", prioridad: 4 },   // Sobremesa
    { nombre: "Brownie", prioridad: 4 }      // Sobremesa
];

test('Debe extraer solo los platos de cocina para la comanda inicial', () => {
    const cocina = obtenerComandaCocina(mesaPrueba);
    expect(cocina.length).toBe(2);
    expect(cocina.some(p => p.nombre === "Crema Cat")).toBe(false);
});

test('Debe extraer solo postres para el segundo pase', () => {
    const sobremesa = obtenerComandaSobremesa(mesaPrueba);
    expect(sobremesa.length).toBe(2);
    expect(sobremesa[0].prioridad).toBe(4);
});