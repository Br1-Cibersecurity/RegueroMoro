// specs/comanda.spec.js
const { ordenarComanda } = require('../src/logica');

test('Regla de El Reguero Moro: El Menú Infantil siempre debe salir primero', () => {
    const pedidoSimulado = [
        { nombre: "Solomillo", prioridad: 3 },
        { nombre: "Infantil", prioridad: 1 },
        { nombre: "Carnivoro", prioridad: 2 }
    ];

    const resultado = ordenarComanda(pedidoSimulado);

    // El primer elemento debe tener prioridad 1
    expect(resultado[0].nombre).toBe("Infantil");
    // El segundo debe ser el menú (prioridad 2)
    expect(resultado[1].nombre).toBe("Carnivoro");
});