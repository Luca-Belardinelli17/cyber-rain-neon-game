const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables de estado del juego
let playerName = localStorage.getItem('cyber_operator') || ""; 
let scoreData = 0; 
let systemFailure = false; 
let gameOverProcessed = false; 
let animationId; 
let hazardInterval; 
let currentSpawnRate = 800; 

// Elementos del DOM para la interfaz
const startScreen = document.getElementById('start-screen');
const nameInput = document.getElementById('player-name');
const startBtn = document.getElementById('start-btn');

// Pre-completar el cuadro de texto si el usuario ya ingresó un alias anteriormente
if (playerName && playerName !== "ANON") {
    nameInput.value = playerName;
}

// Control de la pantalla de inicio y arranque diferido
startBtn.addEventListener('click', () => {
    let val = nameInput.value.trim();
    if (!val) val = "ANON";
    
    playerName = val.substring(0, 5).toUpperCase();
    localStorage.setItem('cyber_operator', playerName);
    
    startScreen.style.display = 'none';
    
    hazardInterval = setInterval(spawnHazard, currentSpawnRate);
    animationId = requestAnimationFrame(update);
});

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

// --- MODIFICACIÓN: Prevenir comportamientos por defecto del navegador ---
window.addEventListener('keydown', (e) => {
    // Evitar scrolleo con flechas o barra espaciadora
    if (['ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
    }
    
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight'){
        keys[e.code] = true;
    }
    
    // Evitar que el Enter dispare clics accidentales en otros botones de la web
    if (e.code === 'Enter' && systemFailure) {
        e.preventDefault();
        softReset();
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
        speed: baseHazardSpeed + Math.random() * 2 + (scoreData * 0.015), 
        color: '#ee00ff' 
    });
}

function drawRunner() {
    ctx.shadowBlur = 10;
    ctx.shadowColor = runner.color;
    ctx.fillStyle = runner.color;
    ctx.fillRect(runner.x, runner.y, runner.width, runner.height);
    ctx.shadowBlur = 0; 
}

function softReset() {
    scoreData = 0;
    systemFailure = false;
    gameOverProcessed = false;
    hazards = [];
    runner.x = canvas.width / 2 - 20;
    
    // --- NUEVO: Restaurar visuales al reiniciar ---
    runner.color = '#00f3ff';
    canvas.classList.remove('shake');
    
    clearInterval(hazardInterval);
    currentSpawnRate = 800;
    hazardInterval = setInterval(spawnHazard, currentSpawnRate);
    
    animationId = requestAnimationFrame(update);
}

async function processGameOver() {
    try {
        const response = await fetch('http://localhost:3000/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: playerName, score: Math.floor(scoreData) }) 
        });
        
        const result = await response.json();
        
        setTimeout(() => {
            if (systemFailure) {
                displayLeaderboard(result.data);
            }
        }, 1800);

    } catch (error) {
        console.error("Error de conexión con la Red:", error);
    }
}

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

    ctx.fillStyle = '#ee00ff';
    ctx.textAlign = 'center';
    ctx.fillText('ENTER PARA REINICIAR', canvas.width / 2, canvas.height - 80);
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
                
                // --- NUEVO: Feedback visual de impacto ---
                systemFailure = true;
                runner.color = '#ff0055'; // Cambia el bloque a rojo alerta
                canvas.classList.add('shake'); // Ejecuta la animación CSS en el canvas
            }
            if (h.y > canvas.height) { hazards.splice(i, 1); i--; }
        }
        
        scoreData += 0.05;

        if (scoreData > 50 && currentSpawnRate > 600) {
            currentSpawnRate = 600;
            clearInterval(hazardInterval);
            hazardInterval = setInterval(spawnHazard, currentSpawnRate);
        } else if (scoreData > 150 && currentSpawnRate > 400) {
            currentSpawnRate = 400;
            clearInterval(hazardInterval);
            hazardInterval = setInterval(spawnHazard, currentSpawnRate);
        }
    }

    ctx.fillStyle = 'rgba(5, 5, 8, 0.3)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawRunner();
    
    for (let i = 0; i < hazards.length; i++) {
        let h = hazards[i];
        ctx.fillStyle = h.color;
        ctx.fillRect(h.x, h.y, h.width, h.height);
    }

    document.getElementById('score-label').innerText = `OP: [${playerName}] | DATOS: ${Math.floor(scoreData)} TB`;

    if (systemFailure) {
        cancelAnimationFrame(animationId);

        ctx.fillStyle = 'rgba(10, 10, 18, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ff0055'; // Cartel rojo para sumar al feedback
        ctx.font = '30px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText('SISTEMA CORRUPTO', canvas.width / 2, canvas.height / 2);
        
        if (!gameOverProcessed) {
            gameOverProcessed = true;
            processGameOver();
        }
        return; 
    }

    animationId = requestAnimationFrame(update);
}