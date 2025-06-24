console.log('JavaScript file is loading...');

// Global variables
let gameRunning = false;
let snake = [];
let food = {};
let direction = 'right';
let score = 0;
let gameSpeed = 100; // Default speed
let difficulty = 'easy';

// Add event listeners for select elements
window.onload = function() {
    const difficultySelect = document.getElementById('difficulty-select');
    const speedSelect = document.getElementById('speed-select');
    
    if (difficultySelect) {
        console.log('Difficulty select found');
        difficultySelect.addEventListener('change', function(e) {
            console.log('Difficulty changed to:', e.target.value);
            updateDifficulty(e.target.value);
        });
    }
    
    if (speedSelect) {
        console.log('Speed select found');
        speedSelect.addEventListener('change', function(e) {
            console.log('Speed changed to:', e.target.value);
            updateSpeed(e.target.value);
        });
    }
};

// Global functions for select changes
window.updateDifficulty = function(newDifficulty) {
    console.log('Difficulty changed to:', newDifficulty);
    difficulty = newDifficulty;
    // Adjust speed based on difficulty
    switch(difficulty) {
        case 'easy':
            gameSpeed = 100;
            break;
        case 'medium':
            gameSpeed = 80;
            break;
        case 'hard':
            gameSpeed = 60;
            break;
    }
    console.log('New game speed:', gameSpeed);
    updateGameSpeed();
};

window.updateSpeed = function(newSpeed) {
    console.log('Speed changed to:', newSpeed);
    gameSpeed = parseInt(newSpeed);
    console.log('New game speed:', gameSpeed);
    updateGameSpeed();
};

// Function to update game speed
function updateGameSpeed() {
    console.log('Updating game speed to:', gameSpeed);
    // If game is running, restart it with new speed
    if (gameRunning) {
        gameRunning = false;
        initGame();
    }
}

// Game configuration
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startGame');

    // Debug: Check all elements
    console.log('Canvas found:', !!canvas);
    console.log('Context found:', !!ctx);
    console.log('Start button found:', !!startButton);

    if (!canvas || !ctx || !startButton) {
        console.error('One or more required elements not found!');
        return;
    }

    // Game initialization
    function initGame() {
        snake = [{ x: 10, y: 10 }];
        score = 0;
        spawnFood();
        gameRunning = true;
        updateGame();
    }

    // Spawn food at random position
    function spawnFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
            y: Math.floor(Math.random() * (canvas.height / 20)) * 20
        };
    }

    // Update game state
    function updateGame() {
        if (!gameRunning) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Move snake
        const head = { ...snake[0] };
        switch (direction) {
            case 'up': head.y -= 20; break;
            case 'down': head.y += 20; break;
            case 'left': head.x -= 20; break;
            case 'right': head.x += 20; break;
        }

        // Wrap around screen edges first
        head.x = (head.x + canvas.width) % canvas.width;
        head.y = (head.y + canvas.height) % canvas.height;

        // Check collisions
        // Only check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameRunning = false;
            alert(`游戏结束！得分: ${score}`);
            return;
        }

        snake.unshift(head);

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            spawnFood();
        } else {
            snake.pop();
        }

        // Draw snake
        snake.forEach(segment => {
            ctx.fillStyle = '#000';
            ctx.fillRect(segment.x, segment.y, 20, 20);
        });

        // Draw food
        ctx.fillStyle = '#f00';
        ctx.fillRect(food.x, food.y, 20, 20);

        // Draw score
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText(`得分: ${score}`, 10, 20);

        // Schedule next update
        setTimeout(updateGame, gameSpeed);
    }

    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    });

    // Start game button
    if (startButton) {
        startButton.addEventListener('click', () => {
            if (!gameRunning) {
                initGame();
            }
        });
    }
});
