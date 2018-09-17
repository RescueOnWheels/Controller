const util = require('../util.js');

class Touch {
  constructor(em) {
    this.emitter = em;
    this.event_types = ['touch', 'untouch'];

    this.state = 0;
    this.press_time = 0;
    this.release_time = 0;
  }

  update(nextState, tx, ty) {
    if (this.state === nextState) {
      return;
    }

    if (this.state === 0 && nextState === 1) {
      this.press_time = Date.now();
      this.state = nextState;

      this.emitter.emit('touch', {
        timestamp: this.press_time,
        x: tx,
        y: ty,
        normx: Math.round(util.map([-32768, 32767], [-1, 1], tx) * 100) / 100,
        normy: Math.round(util.map([-32768, 32767], [-1, 1], ty) * 100) / 100,
      });
    } else {
      this.release_time = Date.now();
      this.state = nextState;

      this.emitter.emit('untouch', {
        timestamp: this.release_time,
        duration: this.release_time - this.press_time,
      });
    }
  }
}

module.exports = Touch;
