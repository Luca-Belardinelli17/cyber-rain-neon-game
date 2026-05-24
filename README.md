# Neon Runner - Arcade Game 🕹️

### Estado Actual: 'Fase 1 - Arquitectura de Red y Loop del Videojuego'

## 🌌 Temática y Concepto
El proyecto ambienta un videojuego de estilo arcade retro con estética ciberpunk y visuales basados en terminales clásicas. El jugador controla un nodo de datos (`Runner`) de color cian neón que se desplaza horizontalmente por una red informática. El objetivo es absorber la mayor cantidad de información posible (`Terabytes`) mientras se evitan los sectores de código malicioso o bloques corruptos de color magenta que caen de forma continua.

## 🛠️ Tecnologías Implementadas
* **Backend:** Node.js junto con el framework Express para el desarrollo del servidor REST API encargado de gestionar de forma centralizada los rankings de puntuación.
* **Frontend Gráfico:** HTML5 Canvas API para renderizar gráficos bidimensionales en tiempo real de manera eficiente y nativa.
* **Estilos:** CSS3 simulando terminales virtuales CRT con tipografías monoespaciadas y filtros de brillo de alta intensidad (*neon glow*).
* **Lógica del Cliente:** Vanilla JavaScript (ES6+), prescindiendo por completo de motores de videojuegos o librerías externas.

## ⚙️ Procesos Técnicos Implementados en la Fase 1
1. **Infraestructura del Servidor:** Servidor HTTP básico que provee endpoints CORS habilitados (`GET/POST /api/scores`) utilizando estructuras de datos volátiles en memoria.
2. **Game Loop Optimizado:** Ciclo de refresco continuo mediante `requestAnimationFrame()` sincronizado directamente con la tasa de refresco nativa del monitor.
3. **Manejo asíncrono de entradas de usuario:** Captura limpia del periférico del teclado (`keydown`/`keyup`) para prevenir el retardo posicional del personaje (*input lag*).
4. **Cálculo geométrico de colisiones:** Algoritmo AABB (Axis-Aligned Bounding Box) básico para evaluar intersecciones binarias entre vectores de posición en un entorno bidimensional.

## 📋 Requerimientos e Instalación del Entorno
* **Node.js:** Versión LTS instalada en el sistema operativo.
* Un navegador web moderno (Chrome, Firefox, Brave, Safari, Edge).

## 🚀 Instrucciones de Ejecución
1. Abre tu terminal de comandos en la carpeta raíz del proyecto.
2. Instala las dependencias necesarias de Node.js ejecutando:
   ```bash
   npm install

---

### Estado Actual: 'Fase 2 - Integración de API Backend'

## ⚙️ Procesos Técnicos Implementados en la Fase 2
1. **Peticiones HTTP Asíncronas:** Uso de la API `fetch` nativa del navegador bajo un modelo `async/await` para gestionar la comunicación no bloqueante con el servidor.
2. **Sincronización Cliente-Servidor:** Al detectarse un fallo del sistema (Game Over), el cliente empaqueta la puntuación (`scoreData`) en un payload JSON y lo transmite al endpoint `POST /api/scores`.
3. **Renderizado de Datos Dinámicos:** El cliente interpreta la respuesta del servidor y sobreescribe de forma dinámica los pixeles del Canvas para desplegar la tabla de clasificación interactiva (`Leaderboard`).

---

### Estado Actual: `Fase 3 - Refactorización del flujo de estado (Game Over)`

## 🛠️ Mejoras y Fixes implementados
* **Corrección de Race Condition Visual:** Resolví un problema de renderizado donde la pantalla de "SISTEMA CORRUPTO" y la tabla de puntajes parpadeaban (superposición de frames). Modifiqué el Game Loop para almacenar el ID del `requestAnimationFrame` y utilizar `cancelAnimationFrame()` en el momento exacto del impacto.
* **Optimización de memoria:** Al cortar el ciclo de renderizado nativo, evito que el Canvas siga consumiendo recursos pintando el fondo mientras el jugador revisa la tabla de clasificaciones.
* **UX/UI Básica:** Agregué un indicador visual simple para indicarle al jugador cómo reiniciar el estado de la aplicación luego de perder.

---

### Estado Actual: `Fase 4 - Identidad y Game Loop Autónomo`

## 🕹️ Funcionalidades añadidas
* **Gestión de Sesión Simple:** Implementé un sistema de captura de alias mediante la Web API. Para evitar fricción en la experiencia, el alias ingresado se persiste en el `localStorage` del navegador, manteniéndolo activo entre sesiones.
* **Payload Dinámico:** Eliminé los datos hardcodeados en las peticiones HTTP. Ahora el `POST` al backend incluye la variable de estado dinámica del jugador.
* **Soft Reset (Reinicio en caliente):** Escribí una función de limpieza de estado (`softReset`) atada a un EventListener de la tecla `Enter`. Esto permite reiniciar las variables del entorno físico y reanudar el `requestAnimationFrame` sin necesidad de forzar una recarga del DOM (F5), mejorando drásticamente el ritmo de juego.

---

### Estado Actual: `Fase 5 - Balanceo y Escalado de Dificultad`

## ⚖️ Ajustes de Game Design
* **Dificultad Progresiva (Progressive Scaling):** Modifiqué el algoritmo de generación de obstáculos (`hazards`). Ahora, la velocidad terminal de caída incluye un multiplicador basado en la variable `scoreData`. A medida que el operador recolecta más datos, el "sistema" reacciona enviando contramedidas más rápidas.
* **Refactorización del Loop de Spawns:** Sustituí el intervalo estático por un sistema de `clearInterval` dinámico. Al cruzar los umbrales de 50 TB y 150 TB, la tasa de regeneración (spawn rate) de los obstáculos se reduce de 800ms a 600ms y 400ms respectivamente, aumentando la densidad de la lluvia de neón en pantalla.

---

### Estado Actual: `Fase 6 - Integración de UI y Main Menu`

## 🖥️ Interfaz de Usuario e Interacciones
* **Reemplazo de Web APIs Nativas:** Removí la dependencia de la función bloqueante `prompt()` del navegador, la cual presentaba una mala experiencia de usuario.
* **Diseño de Interfaz (GUI):** Implementé un overlay en HTML/CSS estilizado según la temática "Cyberpunk" del proyecto.
* **Validación de Entradas:** Agregué lógica en el cliente para sanitizar el input del usuario (máximo 5 caracteres, forzado estricto a mayúsculas tanto visualmente mediante CSS `text-transform` como a nivel lógico con `.toUpperCase()`), asegurando la integridad de los datos antes de persistirlos en `localStorage` y enviarlos a la base de datos.
* **Control de Flujo del Game Loop:** Modifiqué el ciclo de vida del motor de renderizado. Ahora los procesos asíncronos (`setInterval`) y el pintado en pantalla (`requestAnimationFrame`) se encuentran encapsulados y pausados por defecto, inicializándose únicamente tras la confirmación de identidad del jugador.

---

### Estado Actual: `Fase 8 - Game Feel & Polish`

## 🎨 Ajustes Sensoriales y Usabilidad
* **Manejo de Eventos por Defecto:** Incorporé el método `e.preventDefault()` en el listener de teclado. Esto neutraliza las acciones nativas del navegador (como el scrolling con las flechas o la barra espaciadora), garantizando que el input quede aislado para uso exclusivo del canvas.
* **Feedback Visual de Impacto:** Modifiqué el estado de renderizado del `runner` para que permute su paleta de colores al rojo (`#ff0055`) al detectar una colisión. A nivel de DOM, diseñé una clase CSS con la directiva `@keyframes` para inyectar una animación de traslación (`translate3d`) que genera un efecto de "Screen Shake" en el contenedor HTML al dispararse el Game Over.