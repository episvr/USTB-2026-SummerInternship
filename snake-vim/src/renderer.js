import { CONFIG, TILE_COUNT } from "./config.js";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(this.canvas.width / CONFIG.CANVAS_SIZE, this.canvas.height / CONFIG.CANVAS_SIZE);
    this.scaleFactor = this.canvas.width / CONFIG.CANVAS_SIZE;
  }

  clear() {
    this.ctx.clearRect(0, 0, CONFIG.CANVAS_SIZE, CONFIG.CANVAS_SIZE);
  }

  drawGrid() {
    this.ctx.save();
    this.ctx.strokeStyle = CONFIG.COLORS.grid;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let i = 0; i <= TILE_COUNT; i++) {
      const pos = i * CONFIG.TILE_SIZE;
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, CONFIG.CANVAS_SIZE);
      this.ctx.moveTo(0, pos);
      this.ctx.lineTo(CONFIG.CANVAS_SIZE, pos);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawFood(food, pulse) {
    const x = food.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    const y = food.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    const radius = CONFIG.TILE_SIZE * 0.35;
    const color = food.isWarning ? CONFIG.COLORS.foodWarning : CONFIG.COLORS.food;
    const glowColor = food.isWarning
      ? "rgba(255, 209, 102, 0.5)"
      : CONFIG.COLORS.foodGlow;

    this.ctx.save();
    this.ctx.shadowColor = glowColor;
    this.ctx.shadowBlur = 20 + pulse * 10;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius + pulse * 2, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    this.ctx.beginPath();
    this.ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawSnake(snake) {
    snake.forEach((segment, index) => {
      const x = segment.x * CONFIG.TILE_SIZE;
      const y = segment.y * CONFIG.TILE_SIZE;
      const isHead = index === 0;
      const color = isHead
        ? CONFIG.COLORS.snakeHead
        : CONFIG.COLORS.snakeBody[Math.min(index - 1, CONFIG.COLORS.snakeBody.length - 1)];

      this.ctx.save();
      this.ctx.shadowColor = isHead ? "rgba(0, 245, 212, 0.6)" : "transparent";
      this.ctx.shadowBlur = isHead ? 18 : 0;
      this.ctx.fillStyle = color;
      this.ctx.strokeStyle = CONFIG.COLORS.snakeStroke;
      this.ctx.lineWidth = 2;

      const radius = isHead ? 10 : 6;
      this.roundRect(x + 1, y + 1, CONFIG.TILE_SIZE - 2, CONFIG.TILE_SIZE - 2, radius);
      this.ctx.fill();
      this.ctx.stroke();

      if (isHead) {
        this.drawSnakeEyes(segment);
      }
      this.ctx.restore();
    });
  }

  drawSnakeEyes(head) {
    const centerX = head.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    const centerY = head.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    const eyeOffset = 5;
    const eyeRadius = 3;

    let angle = 0;
    if (head.dx === 1) angle = 0;
    else if (head.dx === -1) angle = Math.PI;
    else if (head.dy === -1) angle = -Math.PI / 2;
    else if (head.dy === 1) angle = Math.PI / 2;

    const leftEye = {
      x: centerX + Math.cos(angle - Math.PI / 3) * eyeOffset,
      y: centerY + Math.sin(angle - Math.PI / 3) * eyeOffset,
    };
    const rightEye = {
      x: centerX + Math.cos(angle + Math.PI / 3) * eyeOffset,
      y: centerY + Math.sin(angle + Math.PI / 3) * eyeOffset,
    };

    this.ctx.fillStyle = "#000";
    this.ctx.beginPath();
    this.ctx.arc(leftEye.x, leftEye.y, eyeRadius, 0, Math.PI * 2);
    this.ctx.arc(rightEye.x, rightEye.y, eyeRadius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = "#fff";
    this.ctx.beginPath();
    this.ctx.arc(leftEye.x - 1, leftEye.y - 1, 1, 0, Math.PI * 2);
    this.ctx.arc(rightEye.x - 1, rightEye.y - 1, 1, 0, Math.PI * 2);
    this.ctx.fill();
  }

  roundRect(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + w, y, x + w, y + h, radius);
    this.ctx.arcTo(x + w, y + h, x, y + h, radius);
    this.ctx.arcTo(x, y + h, x, y, radius);
    this.ctx.arcTo(x, y, x + w, y, radius);
    this.ctx.closePath();
  }

  render({ snake, food, particles }, pulse) {
    this.clear();
    this.drawGrid();
    this.drawFood(food, pulse);
    this.drawSnake(snake);
    particles.render(this.ctx);
  }
}
