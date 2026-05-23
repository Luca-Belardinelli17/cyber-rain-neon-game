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