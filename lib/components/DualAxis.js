const util = require('../util.js');

class DualAxis {
  constructor(em) {
    this.emitter = em;
    this.event_types = ['move start', 'move', 'move stop'];

    this.move_state = {
      x: 0,
      y: 0,
    };

    this.prev_move_state = {
      x: 0,
      y: 0,
    };

    this.move_start = 0;
    this.move_stop = 0;
    this.last_pressed_state = 0;
  }

  swapState(x, y) {
    this.prev_move_state.x = this.move_state.x;
    this.prev_move_state.y = this.move_state.y;
    this.move_state.x = x;
    this.move_state.y = y;
  }

  update(nextX, nextY, pressed) {
    const ctime = Date.now();

    if (!pressed) {
      if (this.last_pressed_state === 1) {
        this.move_stop = ctime;

        this.emitter.emit('move stop', {
          timestamp: ctime,
          duration: this.move_stop - this.move_start,
        });
      }

      this.last_pressed_state = pressed;
    } else if (this.last_pressed_state === 0) {
      this.move_start = ctime;

      this.emitter.emit('move start', {
        timestamp: ctime,
      });
    } else {
      this.last_pressed_state = pressed;
    }

    if (this.prev_move_state.x === nextX && this.prev_move_state.y === nextY) {
      return;
    }

    this.swapState(nextX, nextY);

    this.emitter.emit('move', {
      timestamp: ctime,
      x: this.move_state.x,
      y: this.move_state.y,
      normx: Math.round(util.map([-32768, 32767], [-1, 1], this.move_state.x) * 100) / 100,
      normy: Math.round(util.map([-32768, 32767], [-1, 1], this.move_state.y) * 100) / 100,
      deltax: this.move_state.x - this.prev_move_state.x,
      deltay: this.move_state.y - this.prev_move_state.y,
    });
  }
}

module.exports = DualAxis;
