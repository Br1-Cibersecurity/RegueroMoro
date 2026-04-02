// src/productos.js

const CARTA_REAL = {
    "Entrantes F.": [
        { nombre: "Ensa. Templ", precio: 15.00, prioridad: 3 },
        { nombre: "Ensa. Regue", precio: 13.50, prioridad: 3 },
        { nombre: "Ensa. Endivi", precio: 13.00, prioridad: 3 },
        { nombre: "Carpacc. Bacalao", precio: 18.00, prioridad: 3 },
        { nombre: "Tabla Embu.", precio: 17.00, prioridad: 3 },
        { nombre: "Tosta Pan", precio: 2.80, prioridad: 3 },
        { nombre: "Lengua", precio: 18.00, prioridad: 3 }
    ],
    "Entrantes C.": [
        { nombre: "Tenta. Pulpo", precio: 27.00, prioridad: 3 },
        { nombre: "Gambones", precio: 18.00, prioridad: 3 },
        { nombre: "Caracoles llauna", precio: 17.50, prioridad: 3 },
        { nombre: "Caracoles guisados", precio: 17.50, prioridad: 3 },
        { nombre: "Parri. Verduras", precio: 14.50, prioridad: 3 },
        { nombre: "Salte. Garbanzos", precio: 15.00, prioridad: 3 },
        { nombre: "Croquetas", precio: 13.00, prioridad: 3 },
        { nombre: "Teja Calsots", precio: 15.00, prioridad: 3 },
        { nombre: "Calsots Temp", precio: 15.00, prioridad: 3 }
    ],
    "Arroces y Pastas": [
        { nombre: "Fideuá", precio: 16.50, nota: "mínimo 2", prioridad: 3 },
        { nombre: "Paella Marinera", precio: 16.50, nota: "mínimo 2", prioridad: 3 },
        { nombre: "Arroz negro", precio: 16.50, nota: "mínimo 2", prioridad: 3 },
        { nombre: "Raviolis", precio: 14.00, prioridad: 3 }
    ],
    "Pescados": [
        { nombre: "Bacalao Confit", precio: 24.00, prioridad: 3 },
        { nombre: "Bacalao muselina", precio: 24.00, prioridad: 3 },
        { nombre: "Lubina brasa", precio: 30.00, prioridad: 3 }
    ],
    "Carnes": [
        { nombre: "Solomillo", precio: 26.50, prioridad: 3 },
        { nombre: "Lomo bajo", precio: 42.00, prioridad: 3 },
        { nombre: "Paletilla", precio: 38.00, prioridad: 3 },
        { nombre: "Picaña", precio: 27.50, prioridad: 3 }
    ],
    "Menus": [
        { nombre: "Infantil", precio: 15.00, prioridad: 1 },
        { nombre: "Carnivoro", precio: 78.00, prioridad: 2 },
        { nombre: "Paletilla", precio: 78.00, prioridad: 2 },
        { nombre: "Mar", precio: 78.00, prioridad: 2 },
        { nombre: "Calsotada", precio: 76.00, prioridad: 2 }
    ],
    "Postres": [
        { nombre: "Mous. Mascar", precio: 6.00, prioridad: 4 },
        { nombre: "Brownie", precio: 6.00, prioridad: 4 },
        { nombre: "Tarta Queso", precio: 6.00, prioridad: 4 },
        { nombre: "Crema Cat", precio: 6.00, prioridad: 4 },
        { nombre: "Piña Regue", precio: 6.50, prioridad: 4 },
        { nombre: "Bolas Helado", precio: 4.50, prioridad: 4 }
    ]
};

module.exports = { CARTA_REAL };