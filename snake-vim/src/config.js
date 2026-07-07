export const CONFIG = {
  CANVAS_SIZE: 600,
  TILE_SIZE: 30,
  BASE_SPEED: 130,
  MIN_SPEED: 55,
  SPEED_DECREMENT_PER_LEVEL: 8,
  POINTS_PER_FOOD: 10,
  FOOD_LIFETIME: 8000,
  FOOD_WARNING_TIME: 3000,
  COLORS: {
    background: "#0f111a",
    grid: "rgba(122, 162, 247, 0.1)",
    snakeHead: "#7aa2f7",
    snakeBody: ["#7aa2f7", "#565f89", "#414868"],
    snakeStroke: "rgba(15, 17, 26, 0.5)",
    food: "#bb9af7",
    foodGlow: "rgba(187, 154, 247, 0.7)",
    foodWarning: "#e0af68",
    particle: ["#bb9af7", "#7aa2f7", "#7dcfff", "#9ece6a"],
  },
  DIFFICULTY: {
    normal: { speedFactor: 1, bonusMultiplier: 1 },
    hard: { speedFactor: 1.4, bonusMultiplier: 1.5 },
    insane: { speedFactor: 1.9, bonusMultiplier: 2.5 },
  },
};

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const TILE_COUNT = CONFIG.CANVAS_SIZE / CONFIG.TILE_SIZE;
