document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const runner = document.getElementById('runner');
    const obstacle = document.getElementById('obstacle');
    const scoreElement = document.getElementById('score');
    const speedElement = document.getElementById('speed');
    const startBtn = document.getElementById('start-btn');
    const jumpBtn = document.getElementById('jump-btn');
    
    // Game variables
    let gameRunning = false;
    let score = 0;
    let speed = 1;
    let gameSpeed = 2; // Initial speed for obstacle movement
    let gameLoop;
    let obstacleInterval;
    let speedIncreaseInterval;
    let jumpCooldown = false;
    
    // Game state
    let isJumping = false;
    let obstaclePosition = 800; // Start position for obstacle
    let obstacleActive = false;
    let obstaclePassed = false; // Track if obstacle has been passed
    
    // Start the game
    startBtn.addEventListener('click', startGame);
    
    // Jump functionality
    jumpBtn.addEventListener('click', () => {
        if (gameRunning && !isJumping && !jumpCooldown) {
            jump();
        }
    });
    
    // Also allow spacebar to jump
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameRunning && !isJumping && !jumpCooldown) {
            e.preventDefault();
            jump();
        }
    });
    
    function startGame() {
        // Reset game state
        gameRunning = true;
        score = 0;
        speed = 13;  // Start at speed level 13
        gameSpeed = 2 + (12 * 0.5);  // Calculate gameSpeed for speed level 13 (base speed 2 + 12 levels * 0.5)
        obstaclePosition = 800;
        obstacleActive = false;
        obstaclePassed = false;
        isJumping = false;
        jumpCooldown = false;
        
        // Update UI
        scoreElement.textContent = score;
        speedElement.textContent = speed + 'x';
        startBtn.textContent = 'Restart Game';
        
        // Remove any existing game over message
        const gameOverElement = document.querySelector('.game-over');
        if (gameOverElement) {
            gameOverElement.remove();
        }
        
        // Ensure obstacle is hidden at start
        obstacle.style.display = 'none';
        
        // Add running animation
        runner.classList.add('running');
        
        // Start game loop
        clearInterval(gameLoop);
        clearInterval(obstacleInterval);
        clearInterval(speedIncreaseInterval);
        
        gameLoop = setInterval(updateGame, 20); // ~50 FPS
        obstacleInterval = setInterval(spawnObstacle, 2000); // Spawn obstacle every 2 seconds
        speedIncreaseInterval = setInterval(increaseSpeed, 5000); // Increase speed every 5 seconds
        
        // Initial obstacle
        setTimeout(spawnObstacle, 1000);
    }
    
    function updateGame() {
        if (!gameRunning) return;
        
        // Move obstacle
        if (obstacleActive) {
            obstaclePosition -= gameSpeed;
            // Update the position using CSS right property
            obstacle.style.right = (800 - obstaclePosition) + 'px';
            
            // Check if obstacle is off screen
            if (obstaclePosition < -50) {
                obstacleActive = false;
                obstacle.style.display = 'none';
                obstaclePassed = false;
                score += 10;
                scoreElement.textContent = score;
            }
            
            // Check collision
            if (checkCollision()) {
                gameOver();
            }
                    
            // Check if obstacle has passed the runner
            if (obstacleActive && !obstaclePassed && obstaclePosition < 100) { // When obstacle is past the runner
                obstaclePassed = true;
                score += 10;
                scoreElement.textContent = score;
            }
        }
    }
    
    function spawnObstacle() {
        if (!gameRunning) return;
        
        obstacleActive = true;
        obstaclePosition = 800;
        obstacle.style.display = 'block';
        obstacle.style.right = '-50px';
        obstaclePassed = false;
    }
    
    function jump() {
        if (isJumping) return;
        
        isJumping = true;
        jumpCooldown = true;
        runner.classList.add('jumping');
        
        // Jump animation
        setTimeout(() => {
            runner.classList.remove('jumping');
            setTimeout(() => {
                isJumping = false;
                jumpCooldown = false;
            }, 100); // Cooldown period
        }, 400); // Jump duration
    }
    
    function increaseSpeed() {
        if (!gameRunning) return;
        
        speed++;
        gameSpeed += 0.5;
        speedElement.textContent = speed + 'x';
    }
    
    function checkCollision() {
        if (!obstacleActive) return false;
        
        // Get positions
        const runnerRect = runner.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        
        // Calculate positions
        const runnerLeft = runnerRect.left;
        const runnerRight = runnerRect.right;
        const runnerTop = runnerRect.top;
        const runnerBottom = runnerRect.bottom;
        
        const obstacleLeft = obstacleRect.left;
        const obstacleRight = obstacleRect.right;
        const obstacleTop = obstacleRect.top;
        const obstacleBottom = obstacleRect.bottom;
        
        // Check for horizontal overlap
        const horizontalOverlap = runnerRight > obstacleLeft && runnerLeft < obstacleRight;
        
        // Check for vertical overlap (if runner is at same height as obstacle)
        const verticalOverlap = runnerBottom > obstacleTop;
        
        // Collision occurs when both horizontal and vertical overlap exist
        if (horizontalOverlap && verticalOverlap) {
            return true; // Collision detected
        }
        
        return false;
    }
    
    function gameOver() {
        gameRunning = false;
        
        clearInterval(gameLoop);
        clearInterval(obstacleInterval);
        clearInterval(speedIncreaseInterval);
        
        // Remove running animation
        runner.classList.remove('running');
        
        // Show game over message
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.innerHTML = `
            <h2>Game Over!</h2>
            <p>Final Score: ${score}</p>
            <p>Speed Level: ${speed}x</p>
            <button id="restart-btn">Play Again</button>
        `;
        
        // Add event listener to the restart button
        setTimeout(() => {
            document.getElementById('restart-btn').addEventListener('click', startGame);
        }, 100);
        document.querySelector('.game-area').appendChild(gameOverDiv);
    }
    
    // Initialize game state
    obstacle.style.display = 'none';
});