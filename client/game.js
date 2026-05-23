const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let scoreData = 0; 
let systemFailure = false; 
let gameOverProcessed = false; // Nueva bandera para evitar spam a la API
let animationId; // --- NUEVO: Control de la animación para frenar el loop ---

const runner = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 30,
    width: 40,
    height: 15,
    speed: 6,
    color: '#00f3ff' 
};

const keys = {
    ArrowLeft: false,
    ArrowRight: false
};

window.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight'){
        keys[e.code] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') { 
        keys[e.code] = false;
    }
});

let hazards = []; 
let baseHazardSpeed = 3; 

function spawnHazard() {
    if (systemFailure) return; 
    const w = Math.random() * 25 + 15; 
    const x = Math.random() * (canvas.width - w); 
    hazards.push({ 
        x, 
        y: -30, 
        width: w, 
        height: w, 
        speed: baseHazardSpeed + Math.random() * 2, 
        color: '#ee00ff' 
    });
}

setInterval(spawnHazard, 800);

function drawRunner() {
    ctx.shadowBlur = 10;
    ctx.shadowColor = runner.color;
    ctx.fillStyle = runner.color;
    ctx.fillRect(runner.x, runner.y, runner.width, runner.height);
    ctx.shadowBlur = 0; 
}

// --- NUEVA FUNCIÓN: Comunicación con la API ---
async function processGameOver() {
    try {
        const response = await fetch('http://localhost:3000/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: "LUC", score: Math.floor(scoreData) }) // Nombre estático temporal
        });
        
        const result = await response.json();
        displayLeaderboard(result.data);
    } catch (error) {
        console.error("Error de conexión con la Red:", error);
    }
}

// --- NUEVA FUNCIÓN: Dibujo de la tabla de posiciones ---
function displayLeaderboard(scores) {
    ctx.fillStyle = 'rgba(10, 10, 18, 0.95)';
    ctx.fillRect(40, 60, canvas.width - 80, canvas.height - 120);
    
    ctx.fillStyle = '#00f3ff';
    ctx.font = 'bold 22px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('--- TOP RUNNERS ---', canvas.width / 2, 100);
    
    ctx.font = '18px "Courier New"';
    ctx.textAlign = 'left';
    scores.forEach((entry, index) => {
        const yPos = 150 + (index * 40);
        ctx.fillText(`${index + 1}. ${entry.username}`, 70, yPos);
        ctx.fillText(`${entry.score} TB`, 240, yPos);
    });

    // --- NUEVO: Indicador para recargar ---
    ctx.fillStyle = '#ee00ff';
    ctx.textAlign = 'center';
    ctx.fillText('F5 PARA REINICIAR', canvas.width / 2, canvas.height - 80);
}

function update() {
    if (!systemFailure) {
        if (keys.ArrowLeft && runner.x > 0) runner.x -= runner.speed;
        if (keys.ArrowRight && runner.x < canvas.width - runner.width) runner.x += runner.speed;
        
        for (let i = 0; i < hazards.length; i++) {
            let h = hazards[i];
            h.y += h.speed;

            if (runner.x < h.x + h.width && runner.x + runner.width > h.x && 
                runner.y < h.y + h.height && runner.y + runner.height > h.y) {
                systemFailure = true;
            }
            if (h.y > canvas.height) { hazards.splice(i, 1); i--; }
        }
        
        scoreData += 0.05;
    }

    ctx.fillStyle = 'rgba(5, 5, 8, 0.3)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRunner();
    
    for (let i = 0; i < hazards.length; i++) {
        let h = hazards[i];
        ctx.fillStyle = h.color;
        ctx.fillRect(h.x, h.y, h.width, h.height);
    }

    document.getElementById('score-label').innerText = `DATOS RECOLECTADOS: ${Math.floor(scoreData)} TB`;

    // --- MODIFICACIÓN: Disparador del Game Over refactorizado ---
    if (systemFailure) {
        // Cancelamos el próximo frame para detener el renderizado continuo y evitar el parpadeo
        cancelAnimationFrame(animationId);

        ctx.fillStyle = 'rgba(10, 10, 18, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ee00ff';
        ctx.font = '30px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('SISTEMA CORRUPTO', canvas.width / 2, canvas.height / 2);
        
        // Llamar a la API solo una vez de forma segura
        if (!gameOverProcessed) {
            gameOverProcessed = true;
            processGameOver();
        }
        return; // Salimos de la función para cortar definitivamente el ciclo
    }

    // Guardamos el ID del frame para poder cancelarlo cuando el jugador pierda
    animationId = requestAnimationFrame(update);
}

// Iniciar el ciclo guardando su referencia
animationId = requestAnimationFrame(update);