import { DIRECTIONS } from "./config.js";

export class InputManager {
  constructor(onDirection, onPause, onStart) {
    this.onDirection = onDirection;
    this.onPause = onPause;
    this.onStart = onStart;
    this.vimMode = false;
    this.touchStart = null;
    this.boundKeydown = this.handleKeydown.bind(this);
    this.boundTouchStart = this.handleTouchStart.bind(this);
    this.boundTouchEnd = this.handleTouchEnd.bind(this);
    this.bind();
  }

  setVimMode(enabled) {
    this.vimMode = enabled;
  }

  bind() {
    window.addEventListener("keydown", this.boundKeydown);
    window.addEventListener("touchstart", this.boundTouchStart, { passive: false });
    window.addEventListener("touchend", this.boundTouchEnd, { passive: false });

    document.querySelectorAll(".dpad__btn").forEach((btn) => {
      btn.addEventListener("touchstart", (e) => {
        e.preventDefault();
        this.onDirection(btn.dataset.dir);
      });
      btn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.onDirection(btn.dataset.dir);
      });
    });

    const pauseBtn = document.getElementById("pause-btn");
    pauseBtn?.addEventListener("click", () => this.onPause());

    const startBtn = document.getElementById("start-btn");
    startBtn?.addEventListener("click", () => this.onStart());
  }

  handleKeydown(e) {
    const vimKeyMap = {
      KeyK: "up",
      KeyJ: "down",
      KeyH: "left",
      KeyL: "right",
    };

    if (this.vimMode) {
      if (vimKeyMap[e.code]) {
        e.preventDefault();
        this.onDirection(vimKeyMap[e.code]);
        return;
      }
    } else {
      const keyMap = {
        ArrowUp: "up",
        KeyW: "up",
        ArrowDown: "down",
        KeyS: "down",
        ArrowLeft: "left",
        KeyA: "left",
        ArrowRight: "right",
        KeyD: "right",
      };

      if (keyMap[e.code]) {
        e.preventDefault();
        this.onDirection(keyMap[e.code]);
        return;
      }
    }

    if (e.code === "Space") {
      e.preventDefault();
      this.onPause();
    }

    if (e.code === "Enter") {
      e.preventDefault();
      this.onStart();
    }
  }

  handleTouchStart(e) {
    if (e.target.closest(".dpad__btn") || e.target.closest("button")) return;
    this.touchStart = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
  }

  handleTouchEnd(e) {
    if (!this.touchStart) return;
    const dx = e.changedTouches[0].clientX - this.touchStart.x;
    const dy = e.changedTouches[0].clientY - this.touchStart.y;
    const minSwipe = 40;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
      this.onDirection(dx > 0 ? "right" : "left");
    } else if (Math.abs(dy) > minSwipe) {
      this.onDirection(dy > 0 ? "down" : "up");
    }

    this.touchStart = null;
  }

  destroy() {
    window.removeEventListener("keydown", this.boundKeydown);
    window.removeEventListener("touchstart", this.boundTouchStart);
    window.removeEventListener("touchend", this.boundTouchEnd);
  }
}
