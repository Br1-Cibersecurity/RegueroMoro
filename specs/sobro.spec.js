const { test, expect } = require('spec-kit');

test('La propina debe integrarse en el pedido y sumarse al total', () => {
    const pedido = [{ nombre: 'Caña', precio: 2.50 }];
    const propina = 1.00;
    
    // Simulación de nuestra lógica de negocio
    if(propina > 0) {
        pedido.push({ nombre: "PROPINA", precio: propina });
    }
    
    const totalCaja = pedido.reduce((acc, p) => acc + p.precio, 0);
    expect(totalCaja).toBe(3.50);
    expect(pedido.some(p => p.nombre === "PROPINA")).toBe(true);
});