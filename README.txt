📖 DOCUMENTACIÓN TÉCNICA Y ARQUITECTURA - EL REGUERO MORO
Este documento detalla las bases técnicas, el planteamiento estructural, las herramientas utilizadas y el proceso de instalación en producción del sistema TPV y Dashboard para el restaurante El Reguero Moro.

1. Stack Tecnológico (Lenguajes y Herramientas)
El sistema ha sido construido prescindiendo de frameworks pesados (como React o Angular) o gestores de bases de datos complejos (como MySQL). Esto garantiza un software ultraligero, rápido y 100% independiente de suscripciones de terceros.

Frontend (Interfaz de Usuario):

HTML5: Estructura semántica de las aplicaciones (index.html y maestro.html).

CSS3 Puro: Diseño, animaciones, sistema de grillas (CSS Grid) y diseño flexible (Flexbox). No utiliza librerías como Bootstrap, lo que reduce el peso a la mínima expresión.

Vanilla JavaScript (ES6+): Lógica del cliente, cálculos matemáticos del TPV, filtrado en vivo y manipulación del DOM (interfaz visual).

Backend (Servidor):

Node.js: Entorno de ejecución que permite ejecutar JavaScript como un servidor local.

Express.js: Micro-framework para levantar la API REST que procesa y enruta las peticiones de los camareros a la base de datos.

Módulo fs (File System): Herramienta nativa de Node.js para interactuar directamente con el disco duro del ordenador maestro.

2. Planteamiento y Arquitectura del Sistema
2.1. Base de Datos Flat-File (JSON)
En lugar de una base de datos relacional tradicional, el sistema utiliza archivos de texto plano estructurados en formato .json.

Ventajas: Copias de seguridad instantáneas (basta con copiar una carpeta), cero configuraciones de servidor de bases de datos, y lectura humana si hay fallos.

Archivos clave:

carta.json: Base de datos de productos (modificable desde el Maestro).

mesas_activas.json: Guarda el estado en vivo de la sala.

caja.json: Recopila las ventas y propinas antes del cierre.

historial_menus_diarios.json: Almacena la configuración de las últimas 5 semanas de menús.

historial/: Carpeta donde se empaqueta cada jornada cerrada de manera inmutable para auditorías.

2.2. Sincronización en Tiempo Real (Short-Polling)
Para que las tablets se actualicen solas cuando el Maestro cambia un precio o edita la carta, se utiliza una técnica de Short-Polling:

Cada 3 segundos, las tablets "preguntan" de forma invisible al servidor por el estado del restaurante.

El servidor emite una variable cartaVersion (un sello de tiempo). Si la versión cambia, el dispositivo camarero descarga la nueva carta y se repinta automáticamente sin intervención del usuario.

2.3. Single Page Application (SPA) y Modales Nativos
SPA: Las apps no cambian de página web al navegar. Muestran y ocultan secciones instantáneamente (cambiando display: none a display: grid), evitando tiempos de carga.

Modales Customizados: Se han sustituido los pop-ups intrusivos del navegador por ventanas modales diseñadas a medida, ofreciendo una sensación total de App nativa.

2.4. Algoritmos de Desglose (Regex)
El sistema utiliza Expresiones Regulares para transformar pedidos complejos en órdenes de cocina limpias. Extrae variables como [Punto Menos] o [1º: Macarrones] del nombre del producto y las indenta automáticamente para el formato de papel térmico.

3. UI/UX (Diseño de Interfaces)
El diseño está estrictamente pensado para el flujo de trabajo en hostelería:

App Camarero (Dark Mode): * Objetivo: Ahorro masivo de batería en los móviles y reducción de fatiga visual en entornos oscuros.

Colores: Fondo profundo (#0f1215) con acentos dorados (#d4af37) para botones de acción.

App Maestro (Dashboard Light): * Objetivo: Legibilidad absoluta para análisis financiero y configuración administrativa. Imitación de la tinta sobre papel.

Tipografías:

Cinzel: Elegancia y clasicismo para encabezados (identidad de "El Reguero Moro").

Montserrat: Geometría y legibilidad extrema para el listado de botones y productos en pantallas pequeñas.

4. Instalación y Puesta a Punto en el Restaurante
Actualmente el sistema corre en "Fase de Desarrollo" (localhost:3000). La transición a "Fase de Producción" en el restaurante constará de los siguientes pasos:

Paso 1: Configuración de Red Local (LAN)
Se requiere un router Wi-Fi en el restaurante. No requiere internet externo, solo red de área local.

El ordenador principal (Maestro) se conecta a este router y se le asigna una IP local estática (ej: 192.168.1.50).

Paso 2: El Ordenador Maestro (Electron.js)
El código actual se "empaquetará" utilizando Electron.js.

Esto generará un archivo instalable tradicional (.exe para Windows o .app para Mac).

Al abrir este archivo en el ordenador del restaurante, levantará el servidor Node.js en segundo plano y abrirá la ventana del Maestro como un programa de escritorio clásico. No habrá barras de direcciones ni pestañas del navegador.

Paso 3: Las Tablets/Móviles (Progressive Web App - PWA)
Se conecta el móvil del camarero a la red Wi-Fi del restaurante.

Se abre el navegador del móvil e introduce la IP del ordenador maestro (ej: http://192.168.1.50:3000).

El navegador ofrecerá la opción "Añadir a la pantalla de inicio".

Al hacerlo, se instalará como una app nativa en el móvil, con el icono del restaurante. Al abrirla, desaparecerán los controles del navegador y funcionará a pantalla completa, con actualizaciones inmediatas desde el Maestro.

5. Escalabilidad y Futuras Actualizaciones
La arquitectura modular e independiente elegida permite escalar el sistema sin límites. Futuras adiciones viables incluyen:

Gestión de Stock/Inventario: Añadir un archivo stock.json que reste ingredientes automáticamente basándose en los platos vendidos.

Impresión Física Real: Conectar el servidor Node.js mediante USB, Red o Bluetooth a una impresora térmica EPSON/Bixolon para lanzar los tickets de comanda y recibos físicamente a cocina y caja de forma automática.

Roles de Seguridad Avanzados: Establecer contraseñas PIN numéricas para el administrador y limitar las funciones de anular platos en mesas a ciertos perfiles de camarero.

Códigos QR en Mesa: Levantar un endpoint público para que los clientes escaneen un QR, vean la carta dinámica desde sus móviles e incluso pidan directamente, conectándose al mismo servidor.

Pasarelas de Pago: Integración de datáfonos inalámbricos o herramientas como Stripe/Redsys si se desean pagos integrados o reservas previas online.
