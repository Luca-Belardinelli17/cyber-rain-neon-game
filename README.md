# 🌆 Cyber Rain - Full-Stack Arcade Game

Un videojuego arcade web interactivo con estética Cyberpunk Neón. El proyecto cuenta con una arquitectura Full-Stack completa, separando un cliente enriquecido en el Frontend y un servidor de persistencia de datos en el Backend, ambos desplegados en la nube.

## 🚀 Despliegue en la Nube (Live Demo)
* **🎮 Jugar el juego (Frontend):** [https://cyber-rain.vercel.app/](https://cyber-rain.vercel.app/)
* **⚡ Servidor API (Backend):** [https://cyber-rain-api.onrender.com/](https://cyber-rain-api.onrender.com/)

---

## 🛠️ Tecnologías Utilizadas

### Frontend (Cliente):
* **HTML5 & Canvas API:** Renderizado del motor de juego y manipulación de gráficos 2D en tiempo real.
* **CSS3 (Animaciones avanzadas):** Estilizado neón ("Cyberpunk-vibe") y efectos de pantalla como *Screen Shake*.
* **JavaScript (Vanilla ES6):** Lógica del Game Loop, detección de colisiones por ejes (AABB) y manejo asíncrono de peticiones de red (`Fetch API`).

### Backend (Servidor):
* **Node.js & Express:** Servidor REST API encargado de procesar y ordenar las puntuaciones de los jugadores.
* **CORS (Cross-Origin Resource Sharing):** Configuración de seguridad para permitir la comunicación fluida entre el dominio del juego y el de la API.

---

## 🕹️ Características de Jugabilidad e Interfaz
* **Menú de Inicio Integrado:** Adiós a los molestos `prompt()` del navegador. Cuenta con una interfaz gráfica (GUI) dedicada con validación de alias (fuerza mayúsculas y limita estrictamente a 5 caracteres).
* **Control de Navegación Protegido:** Bloqueo de comportamientos nativos (`e.preventDefault()`) para evitar que el navegador haga scroll al usar las flechas del teclado o la barra espaciadora.
* **Pacing Dramático (Game Over):** Pausa asíncrona de 1.8 segundos tras el impacto, permitiendo leer el mensaje de alerta antes de renderizar la tabla de líderes.
* **Feedback Sensorial:** El bloque del jugador muta a color rojo de alerta (`#ff0055`) y el Canvas ejecuta una animación de temblor al colisionar.

---

## 📈 Historial de Desarrollo (Fases del Proyecto)

### Fase 1 a 5 - Núcleo del Sistema
* Configuración inicial del servidor Node.js y Express.
* Implementación del bucle principal del juego (Game Loop) con `requestAnimationFrame`.
* Sistema de generación progresiva de obstáculos (`hazards`) con aceleración basada en puntuación.
* Persistencia local con `localStorage` y persistencia global en memoria de servidor para el Top 5 de corredores.

### Fase 6 - Integración de UI y Main Menu
* Removí la dependencia de la función bloqueante `prompt()` del navegador.
* Diseñé un overlay en HTML/CSS estilizado según la temática del proyecto.
* Modifiqué el ciclo de vida del motor de renderizado: los procesos asíncronos (`setInterval`) y el pintado en pantalla se pausan por defecto, inicializándose únicamente tras la confirmación de identidad del jugador.

### Fase 7 - Hotfixes y Pacing del Game Over
* **Consistencia Visual:** Sincronización del borde del contenedor principal (`canvas`) con el color cian neón (`#00f3ff`) del jugador.
* **Ajuste de Tiempo:** Implementación de un delay asíncrono utilizando `setTimeout` en la lógica de Game Over para mejorar el ritmo de la experiencia narrativa.

### Fase 8 - Game Feel & Polish
* **Manejo de Eventos:** Aislamiento absoluto del teclado para evitar scrolleo involuntario.
* **Feedback de Impacto:** Animación de traslación (`translate3d`) en CSS para generar el efecto de sacudida en pantalla y alteración cromática del jugador en rojo de peligro.