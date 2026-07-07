import { AudioManager } from "./src/audio.js";
import { ParticleSystem } from "./src/particles.js";
import { InputManager } from "./src/input.js";
import { Renderer } from "./src/renderer.js";
import { SnakeGame } from "./src/game.js";
import "./style.css";

const canvas = document.getElementById("game");
const scoreEl = document.getElementById("score");
const bestScoreEl = document.getElementById("best-score");
const levelEl = document.getElementById("level");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlay-title");
const overlayDesc = document.getElementById("overlay-desc");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const difficultyBtns = document.querySelectorAll(".difficulty__btn");
const vimToggle = document.getElementById("vim-toggle");
const controlsHint = document.getElementById("controls-hint");

const audio = new AudioManager();
const particles = new ParticleSystem();
const renderer = new Renderer(canvas);
let vimMode = false;

const game = new SnakeGame(
  audio,
  particles,
  (score) => {
    scoreEl.textContent = score;
    if (score > game.highScore) {
      bestScoreEl.textContent = score;
    }
  },
  (level) => {
    levelEl.textContent = level;
  },
  (score) => {
    overlayTitle.textContent = "游戏结束";
    overlayDesc.innerHTML = `最终得分 <strong>${score}</strong><br>点击按钮再来一局`;
    startBtn.textContent = "重新开始";
    overlay.classList.remove("hidden");
    pauseBtn.classList.remove("is-visible");
  }
);

bestScoreEl.textContent = game.highScore;

function updateVimMode(enabled) {
  vimMode = enabled;
  input.setVimMode(enabled);
  vimToggle.setAttribute("aria-pressed", String(enabled));
  vimToggle.classList.toggle("is-active", enabled);

  if (enabled) {
    overlayDesc.textContent = "Vim 模式：用 h(左) j(下) k(上) l(右) 控制小蛇";
    controlsHint.innerHTML = `
      <span class="key">h</span>
      <span class="key">j</span>
      <span class="key">k</span>
      <span class="key">l</span> 移动 ·
      <span class="key">空格</span> 暂停
    `;
  } else {
    overlayDesc.textContent = "用方向键或 WASD 控制小蛇";
    controlsHint.innerHTML = `
      <span class="key">↑↓←→</span> /
      <span class="key">WASD</span> 移动 ·
      <span class="key">空格</span> 暂停
    `;
  }
}

vimToggle.addEventListener("click", () => updateVimMode(!vimMode));

function setDifficulty(difficulty) {
  game.setDifficulty(difficulty);
  difficultyBtns.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.difficulty === difficulty);
  });
}

difficultyBtns.forEach((btn) => {
  btn.addEventListener("click", () => setDifficulty(btn.dataset.difficulty));
});

function startGame() {
  game.start();
  overlay.classList.add("hidden");
  pauseBtn.classList.add("is-visible");
}

function togglePause() {
  if (game.state !== "playing" && game.state !== "paused") return;

  game.togglePause();

  if (game.state === "paused") {
    overlayTitle.textContent = "已暂停";
    overlayDesc.textContent = "点击继续游戏";
    startBtn.textContent = "继续游戏";
    overlay.classList.remove("hidden");
    pauseBtn.classList.remove("is-visible");
  } else {
    overlay.classList.add("hidden");
    pauseBtn.classList.add("is-visible");
  }
}

const input = new InputManager(
  (dir) => game.setDirection(dir),
  () => togglePause(),
  () => {
    if (game.state === "paused") {
      togglePause();
    } else {
      startGame();
    }
  }
);

startBtn.addEventListener("click", () => {
  if (game.state === "paused") {
    togglePause();
  } else {
    startGame();
  }
});

pauseBtn.addEventListener("click", togglePause);

function loop(now) {
  game.update(now);
  particles.update();
  renderer.render(game.getSnapshot(), game.foodPulse);
  requestAnimationFrame(loop);
}

renderer.render(game.getSnapshot(), 0);
requestAnimationFrame(loop);
