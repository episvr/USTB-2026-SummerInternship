import { CONFIG, TILE_COUNT } from "./config.js";

export class SnakeGame {
  constructor(audio, particles, onScoreChange, onLevelChange, onGameOver) {
    this.audio = audio;
    this.particles = particles;
    this.onScoreChange = onScoreChange;
    this.onLevelChange = onLevelChange;
    this.onGameOver = onGameOver;

    this.state = "idle";
    this.difficulty = "normal";
    this.score = 0;
    this.level = 1;
    this.highScore = this.loadHighScore();
    this.snake = [];
    this.food = null;
    this.pendingDirection = null;
    this.lastDirection = "right";
    this.lastMoveTime = 0;
    this.foodSpawnTime = 0;
    this.foodPulse = 0;
    this.spawnFood();
  }

  loadHighScore() {
    try {
      return parseInt(localStorage.getItem("neon-snake-best")) || 0;
    } catch {
      return 0;
    }
  }

  saveHighScore() {
    try {
      localStorage.setItem("neon-snake-best", String(this.highScore));
    } catch {
      // ignore
    }
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  get speed() {
    const base = CONFIG.BASE_SPEED * CONFIG.DIFFICULTY[this.difficulty].speedFactor;
    const levelSpeed = Math.max(
      CONFIG.MIN_SPEED,
      base - (this.level - 1) * CONFIG.SPEED_DECREMENT_PER_LEVEL
    );
    return levelSpeed;
  }

  start() {
    this.state = "playing";
    this.score = 0;
    this.level = 1;
    this.pendingDirection = "right";
    this.lastDirection = "right";
    this.snake = [
      { x: 10, y: 10, dx: 1, dy: 0 },
      { x: 9, y: 10, dx: 1, dy: 0 },
      { x: 8, y: 10, dx: 1, dy: 0 },
    ];
    this.spawnFood();
    this.lastMoveTime = performance.now();
    this.onScoreChange(this.score);
    this.onLevelChange(this.level);
    this.particles.clear();
    this.audio.ensureContext();
  }

  spawnFood() {
    let position;
    do {
      position = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT),
      };
    } while (this.snake.some((s) => s.x === position.x && s.y === position.y));

    this.food = {
      ...position,
      value: 10,
      isWarning: false,
    };
    this.foodSpawnTime = performance.now();
  }

  setDirection(direction) {
    if (this.state !== "playing") return;

    const opposites = {
      up: "down",
      down: "up",
      left: "right",
      right: "left",
    };

    if (opposites[direction] !== this.lastDirection) {
      this.pendingDirection = direction;
    }
  }

  togglePause() {
    if (this.state === "playing") {
      this.state = "paused";
    } else if (this.state === "paused") {
      this.state = "playing";
      this.lastMoveTime = performance.now();
    }
  }

  update(now) {
    if (this.state !== "playing") return;

    this.updateFoodPulse(now);

    if (now - this.lastMoveTime < this.speed) return;
    this.lastMoveTime = now;

    if (this.pendingDirection) {
      this.lastDirection = this.pendingDirection;
      this.pendingDirection = null;
    }

    const dir = this.getDirectionVector(this.lastDirection);
    const head = { ...this.snake[0] };
    head.dx = dir.x;
    head.dy = dir.y;
    head.x += dir.x;
    head.y += dir.y;

    if (this.checkCollision(head)) {
      this.gameOver();
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.eatFood();
    } else {
      this.snake.pop();
    }

    this.audio.move();
  }

  updateFoodPulse(now) {
    const age = now - this.foodSpawnTime;
    this.food.isWarning = age > CONFIG.FOOD_LIFETIME - CONFIG.FOOD_WARNING_TIME;

    if (age > CONFIG.FOOD_LIFETIME) {
      this.spawnFood();
      return;
    }

    this.foodPulse = (Math.sin(now / 150) + 1) / 2;
  }

  getDirectionVector(direction) {
    const vectors = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    return vectors[direction];
  }

  checkCollision(head) {
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      return true;
    }
    return this.snake.some((s) => s.x === head.x && s.y === head.y);
  }

  eatFood() {
    const multiplier = CONFIG.DIFFICULTY[this.difficulty].bonusMultiplier;
    const bonus = this.food.isWarning ? 1 : 1.5;
    const points = Math.round(CONFIG.POINTS_PER_FOOD * multiplier * bonus);

    this.score += points;
    this.onScoreChange(this.score);

    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.saveHighScore();
    }

    const newLevel = Math.floor(this.score / 50) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.onLevelChange(this.level);
      this.audio.levelUp();
    }

    this.particles.emit(this.food.x, this.food.y, 16);
    this.audio.eat();
    this.spawnFood();
  }

  gameOver() {
    this.state = "gameover";
    this.audio.gameOver();
    this.onGameOver(this.score);
  }

  getSnapshot() {
    return {
      snake: this.snake,
      food: this.food,
      particles: this.particles,
      pulse: this.foodPulse,
    };
  }
}
