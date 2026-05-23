const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Servir de forma estática los archivos del cliente gráfico
app.use(express.static('client'));

// Base de datos temporal en memoria para almacenar las puntuaciones
let highScores = [
    { username: "CYBER", score: 150 },
    { username: "NET_R", score: 120 },
    { username: "X_ELITE", score: 90 }
];

// Endpoint para obtener el ranking
app.get('/api/scores', (req, res) => {
    res.json({ data: highScores });
});

// Endpoint para registrar una nueva puntuación
app.post('/api/scores', (req, res) => {
    const { username, score } = req.body;
    if (!username || score === undefined) {
        return res.status(400).json({ error: "Datos de entrada inválidos" });
    }
    
    highScores.push({ username, score });
    highScores.sort((a, b) => b.score - a.score); // Ordenar descendentemente
    highScores = highScores.slice(0, 5); // Mantener solo el Top 5
    
    res.json({ data: highScores });
});

app.listen(PORT, () => {
    console.log(`Servidor de la Red corriendo en http://localhost:${PORT}`);
});