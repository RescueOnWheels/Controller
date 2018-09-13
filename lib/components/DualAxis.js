const util = require('../util.js');

class DualAxis {
  constructor(em) {
    this.emitter = em;
    this.event_types = ['move'];

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
  }

  update(x, y) {
    if (this.prev_move_state.x === x && this.prev_move_state.y === y) {
      return;
    }

    this.prev_move_state = this.move_state;
    this.move_state = {
      x,
      y,
    };

    this.emitter.emit('move', {
      timestamp: Date.now(),
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
