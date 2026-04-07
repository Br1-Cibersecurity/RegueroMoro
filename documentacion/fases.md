# 🗂️ Documentación del Proyecto: TPV El Reguero Moro

## 🏗️ Fase 1: Arquitectura Base y Servidor Local
- **Servidor:** Configuración de servidor Node.js/Express (`index.js`).
- **Base de Datos:** Creación de bases de datos persistentes mediante archivos JSON locales (`caja.json`, `mesas_activas.json`, `estado_turno.json`).
- **Lógica de Negocio:** Definición de prioridades, formateo de tickets de impresión y estructura de productos (`src/logica.js`, `src/productos.js`).

## 🖥️ Fase 2: Panel Maestro y App Camarero (Versión Estable `main`)
- **Panel Maestro:** Interfaz de auditoría (`public/maestro.html`) con gestión de turnos, cajas y lectura de historiales de 7 días.
- **App Camarero:** Interfaz móvil (`public/index.html`) con buscador global, gestión de mesas, comensales (PAX) y puntos de carne.
- **Estado de Git:** *Commit inicial de estabilización de interfaces y comunicación cliente-servidor.*

## 🧠 Fase 3: Autoguardado Inteligente (Rama `feature/autoguardado-inteligente`)
- **Objetivo:** Implementación de guardado automático por inactividad (45s) y detección de cambio de visibilidad (bloqueo de pantalla o guardado en el mandil).
- **Gestión de Estados:** Clasificación dinámica de productos (🟡 *Nuevo*, 🟢 *Impreso/Cocina*, 🔵 *Guardado/Extra*) basada en la interacción del camarero.
- **Estado Actual:** *Preparando implementación de código en rama aislada.*
