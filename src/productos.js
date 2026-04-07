// src/productos.js

const CARTA_REAL = {
    "RACIÓN DE PAN": [
        { nombre: "Ración de Pan", precio: 1.50, prioridad: 1 }
    ],
    "Menus": [
        { nombre: "Menú Diario", precio: 20.00, prioridad: 1 },
        { nombre: "Infantil", precio: 15.00, prioridad: 1 },
        { nombre: "Carnivoro", precio: 78.00, prioridad: 2 },
        { nombre: "Paletilla", precio: 78.00, prioridad: 2 },
        { nombre: "Mar", precio: 78.00, prioridad: 2 },
        { nombre: "Calsotada", precio: 76.00, prioridad: 2 }
    ],
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
    "Postres": [
        { nombre: "Mous. Mascar", precio: 6.00, prioridad: 4 },
        { nombre: "Brownie", precio: 6.00, prioridad: 4 },
        { nombre: "Tarta Queso", precio: 6.00, prioridad: 4 },
        { nombre: "Crema Cat", precio: 6.00, prioridad: 4 },
        { nombre: "Piña Regue", precio: 6.50, prioridad: 4 },
        { nombre: "Bolas Helado", precio: 4.50, prioridad: 4 }
    ],
    "Vinos": {
        "Blancos": [
            { nombre: "Aprendiz", precio: 14.00, prioridad: 4 },
            { nombre: "Castelo de Medina", precio: 15.00, prioridad: 4 },
            { nombre: "Pricum", precio: 18.00, prioridad: 4 },
            { nombre: "Gradonueve", precio: 11.00, prioridad: 4 },
            { nombre: "José Pariente", precio: 18.00, prioridad: 4 },
            { nombre: "Leiras", precio: 19.00, prioridad: 4 },
            { nombre: "Mar de Frades", precio: 29.00, prioridad: 4 },
            { nombre: "Mar de Frades 50Cl", precio: 20.00, prioridad: 4 },
            { nombre: "Casar de Burbia", precio: 20.00, prioridad: 4 },
            { nombre: "Enate", precio: 19.00, prioridad: 4 },
            { nombre: "Marieta M. Códax", precio: 17.00, prioridad: 4 },
            { nombre: "Mara M. Códax", precio: 16.00, prioridad: 4 },
            { nombre: "Don Pedro Souto", precio: 13.50, prioridad: 4 },
            { nombre: "Legaris", precio: 17.00, prioridad: 4 }
        ],
        "Rosados": [
            { nombre: "Aprendiz rosado", precio: 15.00, prioridad: 4 },
            { nombre: "Pricum Barrica", precio: 17.00, prioridad: 4 },
            { nombre: "Gurdos", precio: 19.00, prioridad: 4 }
        ],
        "Tintos": {
            "D.O CyL": [
                { nombre: "Las Quintas", precio: 35.00, prioridad: 4 },
                { nombre: "Aprendiz Tinto", precio: 15.00, prioridad: 4 }
            ],
            "D.O León": [
                { nombre: "Cepas Leonesas", precio: 11.50, prioridad: 4 },
                { nombre: "El Médico", precio: 30.00, prioridad: 4 },
                { nombre: "Gamonal Pardevalles", precio: 20.00, prioridad: 4 }
            ],
            "D.O Bierzo": [
                { nombre: "Pizarras de Otero", precio: 11.50, prioridad: 4 },
                { nombre: "Losada", precio: 19.00, prioridad: 4 },
                { nombre: "Hombros", precio: 25.00, prioridad: 4 },
                { nombre: "Pétalos", precio: 29.00, prioridad: 4 },
                { nombre: "Pittacum Aurea", precio: 27.00, prioridad: 4 }
            ],
            "D.O Toro": [
                { nombre: "Románico", precio: 16.00, prioridad: 4 },
                { nombre: "Flor de Vetus", precio: 18.00, prioridad: 4 },
                { nombre: "Almirez", precio: 32.00, prioridad: 4 }
            ],
            "D.O Ribera": [
                { nombre: "Traslascuestas", precio: 17.00, prioridad: 4 },
                { nombre: "Arzuaga", precio: 35.00, prioridad: 4 },
                { nombre: "Pruno", precio: 20.00, prioridad: 4 },
                { nombre: "Cruz de Alba", precio: 25.00, prioridad: 4 }
            ],
            "D.O Rioja": [
                { nombre: "Ramón Bilbao Reser.", precio: 23.00, prioridad: 4 },
                { nombre: "Viña Pomal Crianza", precio: 18.00, prioridad: 4 },
                { nombre: "Viña Pomal Reserva", precio: 28.00, prioridad: 4 },
                { nombre: "Vallovera", precio: 15.00, prioridad: 4 },
                { nombre: "Marqués Murrieta", precio: 36.00, prioridad: 4 }
            ],
            "D.O Cava": [
                { nombre: "Anna B. Blancs", precio: 24.00, prioridad: 4 },
                { nombre: "Segura Viudas", precio: 25.00, prioridad: 4 },
                { nombre: "Reina M. Cristina", precio: 32.00, prioridad: 4 }
            ],
            "Champagne": [
                { nombre: "Albert Meyer", precio: 80.00, prioridad: 4 }
            ]
        }
    }
};

module.exports = { CARTA_REAL };