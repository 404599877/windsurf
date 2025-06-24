console.log('JavaScript file is loading...');

// Debug: Check if script is loaded before DOM
console.log('Before DOMContentLoaded:', document.readyState);

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    console.log('After DOMContentLoaded:', document.readyState);

    try {
        // Get elements
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const startButton = document.getElementById('startButton');
        const pauseButton = document.getElementById('pauseButton');
        const resumeButton = document.getElementById('resumeButton');
        const stopButton = document.getElementById('stopButton');
        const difficultySelect = document.getElementById('difficulty');
        const speedSelect = document.getElementById('speed');
        const scoreDisplay = document.getElementById('scoreDisplay');

        // Debug: Check all elements
        console.log('Canvas found:', !!canvas);
        console.log('Context found:', !!ctx);
        console.log('Start button found:', !!startButton);
        console.log('Pause button found:', !!pauseButton);
        console.log('Resume button found:', !!resumeButton);
        console.log('Stop button found:', !!stopButton);
        console.log('Difficulty select found:', !!difficultySelect);
        console.log('Speed select found:', !!speedSelect);
        console.log('Score display found:', !!scoreDisplay);

        if (!canvas || !ctx || !startButton || !pauseButton || !resumeButton || 
            !stopButton || !difficultySelect || !speedSelect || !scoreDisplay) {
            console.error('One or more required elements not found!');
            return;
        }

        // Initialize game state
        window.game = {
            canvas: canvas,
            ctx: ctx,
            snake: [],
            food: {},
            direction: 'right',
            score: 0,
            speed: parseInt(speedSelect.value),
            difficulty: difficultySelect.value,
            isRunning: false,
            isPaused: false,
            gameOver: false,
            obstacles: [],
            updateSpeed: function(newSpeed) {
                this.speed = parseInt(newSpeed);
                if (this.isRunning) {
                    this.isRunning = false;
                    initGame();
                }
            },
            updateDifficulty: function(newDifficulty) {
                this.difficulty = newDifficulty;
                // Adjust speed based on difficulty
                switch(newDifficulty) {
                    case 'easy':
                        this.speed = 150;
                        break;
                    case 'medium':
                        this.speed = 100;
                        break;
                    case 'hard':
                        this.speed = 60;
                        break;
                }
                if (this.isRunning) {
                    this.isRunning = false;
                    initGame();
                }
            }
        };

        // Game initialization
        window.initGame = function() {
            // Reset game state
            game.snake = [{ x: 100, y: 100 }];
            game.score = 0;
            game.direction = 'right';
            game.isRunning = true;
            game.isPaused = false;
            game.gameOver = false;
            
            // Generate food and obstacles
            spawnFood();
            generateObstacles();
            
            // Start game loop
            updateGame();
        };

        // Start button handler
        if (startButton) {
            startButton.addEventListener('click', () => {
                if (!game.isRunning) {
                    initGame();
                }
            });
        }

        // Pause button handler
        if (pauseButton) {
            pauseButton.addEventListener('click', () => {
                if (game.isRunning && !game.isPaused) {
                    game.isPaused = true;
                    pauseButton.style.display = 'none';
                    resumeButton.style.display = 'inline-block';
                }
            });
        }

        // Resume button handler
        if (resumeButton) {
            resumeButton.addEventListener('click', () => {
                if (game.isRunning && game.isPaused) {
                    game.isPaused = false;
                    resumeButton.style.display = 'none';
                    pauseButton.style.display = 'inline-block';
                    updateGame(); // Resume game loop
                }
            });
        }

        // Stop button handler
        if (stopButton) {
            stopButton.addEventListener('click', () => {
                if (game.isRunning) {
                    game.isRunning = false;
                    game.isPaused = false;
                    game.gameOver = true;
                    pauseButton.style.display = 'inline-block';
                    resumeButton.style.display = 'none';
                }
            });
        }

        // Difficulty select handler
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                game.updateDifficulty(e.target.value);
            });
        }

        // Speed select handler
        if (speedSelect) {
            speedSelect.addEventListener('change', (e) => {
                game.updateSpeed(e.target.value);
            });
        }

        // Keyboard input handler
        document.addEventListener('keydown', (e) => {
            const opposites = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left'
            };

            if (game.isRunning && !game.isPaused) {
                switch(e.key) {
                    case 'ArrowUp':
                        if (game.direction !== opposites['up']) game.direction = 'up';
                        break;
                    case 'ArrowDown':
                        if (game.direction !== opposites['down']) game.direction = 'down';
                        break;
                    case 'ArrowLeft':
                        if (game.direction !== opposites['left']) game.direction = 'left';
                        break;
                    case 'ArrowRight':
                        if (game.direction !== opposites['right']) game.direction = 'right';
                        break;
                }
            }
        });

        // Game loop
        function updateGame() {
            if (!game.isRunning || game.gameOver) return;
            if (game.isPaused) return;

            // Move snake
            const head = { ...game.snake[0] };
            
            switch (game.direction) {
                case 'up': head.y -= 20; break;
                case 'down': head.y += 20; break;
                case 'left': head.x -= 20; break;
                case 'right': head.x += 20; break;
            }

            // Wrap around screen edges
            head.x = (head.x + game.canvas.width) % game.canvas.width;
            head.y = (head.y + game.canvas.height) % game.canvas.height;

            // Check collisions
            if (game.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                game.gameOver = true;
                alert(`游戏结束！得分: ${game.score}`);
                return;
            }

            // Add new head
            game.snake.unshift(head);

            // Check food collision
            if (head.x === game.food.x && head.y === game.food.y) {
                game.score += 10;
                spawnFood();
            } else {
                game.snake.pop();
            }

            // Clear canvas
            game.ctx.fillStyle = '#fff';
            game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

            // Draw snake
            game.ctx.fillStyle = '#4CAF50';
            game.snake.forEach(segment => {
                game.ctx.fillRect(segment.x, segment.y, 20, 20);
            });

            // Draw food
            game.ctx.fillStyle = '#FF5722';
            game.ctx.fillRect(game.food.x, game.food.y, 20, 20);

            // Draw obstacles
            game.ctx.fillStyle = '#607D8B';
            game.obstacles.forEach(obstacle => {
                game.ctx.fillRect(obstacle.x, obstacle.y, 20, 20);
            });

            // Update score display
            scoreDisplay.textContent = `Score: ${game.score}`;

            // Schedule next update
            setTimeout(updateGame, game.speed);
        }

        // Spawn food
        function spawnFood() {
            const maxX = Math.floor(game.canvas.width / 20) - 1;
            const maxY = Math.floor(game.canvas.height / 20) - 1;
            
            let foodPosition = {
                x: Math.floor(Math.random() * maxX) * 20,
                y: Math.floor(Math.random() * maxY) * 20
            };

            while (game.snake.some(segment => 
                segment.x === foodPosition.x && 
                segment.y === foodPosition.y) ||
                game.obstacles.some(obstacle =>
                obstacle.x === foodPosition.x &&
                obstacle.y === foodPosition.y)) {
                foodPosition = {
                    x: Math.floor(Math.random() * maxX) * 20,
                    y: Math.floor(Math.random() * maxY) * 20
                };
            }

            game.food = foodPosition;
        }

        // Generate obstacles
        function generateObstacles() {
            const numObstacles = 5; // Number of obstacles
            const maxX = Math.floor(game.canvas.width / 20) - 1;
            const maxY = Math.floor(game.canvas.height / 20) - 1;

            game.obstacles = [];
            for (let i = 0; i < numObstacles; i++) {
                let obstacle = {
                    x: Math.floor(Math.random() * maxX) * 20,
                    y: Math.floor(Math.random() * maxY) * 20
                };

                // Ensure obstacle doesn't spawn on snake or food
                while (game.snake.some(segment => 
                    segment.x === obstacle.x && 
                    segment.y === obstacle.y) ||
                    game.food.x === obstacle.x &&
                    game.food.y === obstacle.y) {
                    obstacle = {
                        x: Math.floor(Math.random() * maxX) * 20,
                        y: Math.floor(Math.random() * maxY) * 20
                    };
                }

                game.obstacles.push(obstacle);
            }
        }

    } catch (error) {
        console.error('Error initializing game:', error);
    }
});

// Game configuration
window.startGame = function() {
    if (!game.isRunning) {
        initGame();
    }
};

window.pauseGame = function() {
    if (game.isRunning && !game.isPaused) {
        game.isPaused = true;
        document.getElementById('pauseButton').style.display = 'none';
        document.getElementById('resumeButton').style.display = 'inline-block';
    }
};

window.resumeGame = function() {
    if (game.isRunning && game.isPaused) {
        game.isPaused = false;
        document.getElementById('resumeButton').style.display = 'none';
        document.getElementById('pauseButton').style.display = 'inline-block';
        updateGame(); // Resume game loop
    }
};

window.stopGame = function() {
    if (game.isRunning) {
        game.isRunning = false;
        game.isPaused = false;
        game.gameOver = true;
        document.getElementById('pauseButton').style.display = 'inline-block';
        document.getElementById('resumeButton').style.display = 'none';
    }
};

window.updateDifficulty = function(newDifficulty) {
    game.updateDifficulty(newDifficulty);
};

window.updateSpeed = function(newSpeed) {
    game.updateSpeed(newSpeed);
};

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    console.log('After DOMContentLoaded:', document.readyState);

    try {
        // Get elements
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const startButton = document.getElementById('startButton');
        const difficultySelect = document.getElementById('difficulty');
        const speedSelect = document.getElementById('speed');
        const scoreDisplay = document.getElementById('scoreDisplay');

        // Debug: Check all elements
        console.log('Canvas found:', !!canvas);
        console.log('Context found:', !!ctx);
        console.log('Start button found:', !!startButton);
        console.log('Difficulty select found:', !!difficultySelect);
        console.log('Speed select found:', !!speedSelect);
        console.log('Score display found:', !!scoreDisplay);

        if (!canvas || !ctx || !startButton || !difficultySelect || !speedSelect || !scoreDisplay) {
            console.error('One or more required elements not found!');
            return;
        }

        // Initialize game state
        window.game = {
            canvas: canvas,
            ctx: ctx,
            snake: [{ x: 100, y: 100 }],
            food: {},
            direction: 'right',
            score: 0,
            speed: parseInt(speedSelect.value),
            difficulty: difficultySelect.value,
            isRunning: false,
            isPaused: false,
            gameOver: false,
            obstacles: [],
            updateSpeed: function(newSpeed) {
                this.speed = parseInt(newSpeed);
                if (this.isRunning) {
                    this.isRunning = false;
                    initGame();
                }
            },
            updateDifficulty: function(newDifficulty) {
                this.difficulty = newDifficulty;
                // Adjust speed based on difficulty
                switch(newDifficulty) {
                    case 'easy':
                        this.speed = 150;
                        break;
                    case 'medium':
                        this.speed = 100;
                        break;
                    case 'hard':
                        this.speed = 60;
                        break;
                }
                if (this.isRunning) {
                    this.isRunning = false;
                    initGame();
                }
            }
        };

        // Game initialization function
        window.initGame = function() {
            // Reset game state
            game.snake = [{ x: 100, y: 100 }];
            game.score = 0;
            game.direction = 'right';
            game.isRunning = true;
            game.isPaused = false;
            game.gameOver = false;
            
            // Generate food and obstacles
            spawnFood();
            generateObstacles();
            
            // Start game loop
            updateGame();
        };

        // Initialize game when DOM is loaded
        document.addEventListener('DOMContentLoaded', initGame);

        // Game initialization
        const game = {
            canvas: canvas,
            ctx: ctx,
            snake: [{ x: 100, y: 100 }],
            food: {},
            direction: 'right',
            score: 0,
            speed: parseInt(speedSelect.value),
            difficulty: difficultySelect.value,
            isRunning: false,
            isPaused: false,
            gameOver: false,
            obstacles: [],
            updateSpeed: function(newSpeed) {
                this.speed = parseInt(newSpeed);
                if (this.isRunning) {
                    this.isRunning = false;
                    initGame();
                }
            },
            updateDifficulty: function(newDifficulty) {
                this.difficulty = newDifficulty;
                // Adjust speed based on difficulty
                switch(newDifficulty) {
                    case 'easy':
                        this.speed = 150;
                        break;
                    case 'medium':
                        this.speed = 100;
                        break;
                    case 'hard':
                        this.speed = 60;
                        break;
                }
                if (this.isRunning) {
                    this.isRunning = false;
                    initGame();
                }
            }
        };

        // Add event listeners for difficulty and speed
        difficultySelect.addEventListener('change', (e) => {
            game.updateDifficulty(e.target.value);
        });

        speedSelect.addEventListener('change', (e) => {
            game.updateSpeed(e.target.value);
        });

        // Game initialization function
        window.initGame = function() {
            // Reset game state
            game.snake = [{ x: 100, y: 100 }];
            game.score = 0;
            game.direction = 'right';
            game.isRunning = true;
            game.isPaused = false;
            game.gameOver = false;
            
            // Generate food and obstacles
            spawnFood();
            generateObstacles();
            
            // Start game loop
            updateGame();
        };

        // Initialize game when DOM is loaded
        document.addEventListener('DOMContentLoaded', initGame);

        // Start button handler
        if (startButton) {
            startButton.addEventListener('click', () => {
                if (!game.isRunning) {
                    initGame();
                }
            });
        }

        // Pause button handler
        const pauseButton = document.getElementById('pauseButton');
        if (pauseButton) {
            pauseButton.addEventListener('click', () => {
                if (game.isRunning && !game.isPaused) {
                    game.isPaused = true;
                    pauseButton.style.display = 'none';
                    document.getElementById('resumeButton').style.display = 'inline-block';
                }
            });
        }

        // Resume button handler
        const resumeButton = document.getElementById('resumeButton');
        if (resumeButton) {
            resumeButton.addEventListener('click', () => {
                if (game.isRunning && game.isPaused) {
                    game.isPaused = false;
                    resumeButton.style.display = 'none';
                    pauseButton.style.display = 'inline-block';
                    updateGame(); // Resume game loop
                }
            });
        }

        // Stop button handler
        const stopButton = document.getElementById('stopButton');
        if (stopButton) {
            stopButton.addEventListener('click', () => {
                if (game.isRunning) {
                    game.isRunning = false;
                    game.isPaused = false;
                    game.gameOver = true;
                    pauseButton.style.display = 'inline-block';
                    resumeButton.style.display = 'none';
                }
            });
        }

        // Game initialization
        window.initGame = function() {
            game.snake = [{ x: 10, y: 10 }];
            game.score = 0;
            spawnFood();
            game.isRunning = true;
            game.gameOver = false;
            updateGame();
        };

        // Initialize game when DOM is loaded
        document.addEventListener('DOMContentLoaded', initGame);

        // Spawn food at random position
        function spawnFood() {
            // Generate food at random position
            const maxX = Math.floor(game.canvas.width / 20) - 1;
            const maxY = Math.floor(game.canvas.height / 20) - 1;
            
            // Ensure food doesn't spawn on snake or obstacles
            let foodPosition = {
                x: Math.floor(Math.random() * maxX) * 20,
                y: Math.floor(Math.random() * maxY) * 20
            };

            // Check if food position is valid
            while (game.snake.some(segment => 
                segment.x === foodPosition.x && 
                segment.y === foodPosition.y) ||
                game.obstacles.some(obstacle =>
                obstacle.x === foodPosition.x &&
                obstacle.y === foodPosition.y)) {
                foodPosition = {
                    x: Math.floor(Math.random() * maxX) * 20,
                    y: Math.floor(Math.random() * maxY) * 20
                };
            }

            game.food = foodPosition;
        }

        // Update game state
        function updateGame() {
            if (!game.isRunning || game.gameOver) return;

            // Move snake
            const head = { ...game.snake[0] };
            
            // Get opposite directions for collision prevention
            const opposites = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left'
            };

            // Move snake
            switch (game.direction) {
                case 'up': head.y -= 20; break;
                case 'down': head.y += 20; break;
                case 'left': head.x -= 20; break;
                case 'right': head.x += 20; break;
            }

            // Wrap around screen edges
            head.x = (head.x + game.canvas.width) % game.canvas.width;
            head.y = (head.y + game.canvas.height) % game.canvas.height;

            // Check collisions
            // Only check self collision
            if (game.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                game.gameOver = true;
                alert(`游戏结束！得分: ${game.score}`);
                return;
            }

            // Add new head
            game.snake.unshift(head);

            // Check food collision
            if (head.x === game.food.x && head.y === game.food.y) {
                game.score += 10;
                spawnFood();
            } else {
                game.snake.pop();
            }

            // Clear canvas
            game.ctx.fillStyle = '#fff';
            game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

            // Draw snake
            game.ctx.fillStyle = '#4CAF50';
            game.snake.forEach(segment => {
                game.ctx.fillRect(segment.x, segment.y, 20, 20);
            });

            // Draw food
            game.ctx.fillStyle = '#FF5722';
            game.ctx.fillRect(game.food.x, game.food.y, 20, 20);

            // Draw obstacles
            game.ctx.fillStyle = '#607D8B';
            game.obstacles.forEach(obstacle => {
                game.ctx.fillRect(obstacle.x, obstacle.y, 20, 20);
            });

            // Update score display
            scoreDisplay.textContent = `Score: ${game.score}`;

            // Schedule next update
            setTimeout(updateGame, game.speed);
        }

        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            const opposites = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left'
            };

            switch(e.key) {
                case 'ArrowUp':
                    if (game.direction !== opposites['up']) game.direction = 'up';
                    break;
                case 'ArrowDown':
                    if (game.direction !== opposites['down']) game.direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (game.direction !== opposites['left']) game.direction = 'left';
                    break;
                case 'ArrowRight':
                    if (game.direction !== opposites['right']) game.direction = 'right';
                    break;
            }
        });

        // Start game button
        if (startButton) {
            startButton.addEventListener('click', () => {
                if (!game.isRunning) {
                    initGame();
                }
            });
        }
    } catch (error) {
        console.error('Error initializing game:', error);
    }
});
