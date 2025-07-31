// Configuración del juego
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

const boxSize = 20;
let snake = [];
let direction = 'right';
let food = {};
let score = 0;
let game = null;

// Inicializar el juego
function initGame() {
    // Crear la serpiente inicial
    snake = [
        {x: 9 * boxSize, y: 10 * boxSize},
        {x: 8 * boxSize, y: 10 * boxSize},
        {x: 7 * boxSize, y: 10 * boxSize}
    ];
    
    direction = 'right';
    score = 0;
    scoreDisplay.textContent = `Puntuación: ${score}`;
    gameOverDisplay.style.display = 'none';
    
    // Generar comida
    generateFood();
    
    // Si ya hay un juego en curso, limpiarlo
    if (game) {
        clearInterval(game);
    }
    
    // Iniciar el juego
    game = setInterval(drawGame, 100);
}

// Generar comida en una posición aleatoria
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (canvas.height / boxSize)) * boxSize
    };
    
    // Verificar que la comida no aparezca sobre la serpiente
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
            generateFood();
            return;
        }
    }
}

// Dibujar el juego
function drawGame() {
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar la serpiente
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#4CAF50' : '#8BC34A';
        ctx.fillRect(snake[i].x, snake[i].y, boxSize, boxSize);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(snake[i].x, snake[i].y, boxSize, boxSize);
    }
    
    // Dibujar la comida
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
    
    // Mover la serpiente
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    if (direction === 'right') snakeX += boxSize;
    if (direction === 'left') snakeX -= boxSize;
    if (direction === 'up') snakeY -= boxSize;
    if (direction === 'down') snakeY += boxSize;
    
    // Verificar colisión con la comida
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreDisplay.textContent = `Puntuación: ${score}`;
        generateFood();
    } else {
        // Si no come, quita la cola
        snake.pop();
    }
    
    // Añadir nueva cabeza
    const newHead = {x: snakeX, y: snakeY};
    snake.unshift(newHead);
    
    // Verificar colisiones
    checkCollisions();
}

// Verificar colisiones con los bordes o consigo misma
function checkCollisions() {
    const head = snake[0];
    
    // Colisión con los bordes
    if (
        head.x < 0 || 
        head.y < 0 || 
        head.x >= canvas.width || 
        head.y >= canvas.height
    ) {
        gameOver();
    }
    
    // Colisión consigo misma
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

// Fin del juego
function gameOver() {
    clearInterval(game);
    finalScoreDisplay.textContent = `Puntuación: ${score}`;
    gameOverDisplay.style.display = 'block';
}

// Control con teclado
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const key = event.keyCode;
    
    // Evitar que la serpiente vaya en dirección contraria
    if (key === 37 && direction !== 'right') direction = 'left';
    if (key === 38 && direction !== 'down') direction = 'up';
    if (key === 39 && direction !== 'left') direction = 'right';
    if (key === 40 && direction !== 'up') direction = 'down';
    
    // Controles alternativos (W, A, S, D)
    if (key === 65 && direction !== 'right') direction = 'left';
    if (key === 87 && direction !== 'down') direction = 'up';
    if (key === 68 && direction !== 'left') direction = 'right';
    if (key === 83 && direction !== 'up') direction = 'down';
}

// Botón de reinicio
restartBtn.addEventListener('click', initGame);

// Iniciar el juego al cargar la página
window.onload = initGame;