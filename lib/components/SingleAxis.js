/* eslint-disable max-len */

class SingleAxis {
  constructor(em) {
    this.emitter = em;
    this.event_types = ['move start', 'move', 'move stop'];

    this.move_state = 0;
    this.prev_move_state = 0;
    this.move_start = 0;
    this.move_stop = 0;
  }

  update(nextState) {
    if (this.move_state === nextState) {
      return;
    }

    const ctime = Date.now();

    if ((this.move_state === 0 || this.move_state === 255) && (nextState !== 0 && nextState !== 255)) {
      this.move_start = ctime;
      this.prev_move_state = this.move_state;
      this.move_state = nextState;

      this.emitter.emit('move start', {
        timestamp: ctime,
      });
    } else if ((this.move_state !== 0 && this.move_state !== 255) && (nextState === 0 || nextState === 255)) {
      this.move_stop = ctime;
      this.prev_move_state = this.move_state;
      this.move_state = nextState;

      this.emitter.emit('move stop', {
        timestamp: ctime,
        duration: this.move_stop - this.move_start,
        state: nextState === 0 ? 'released' : 'pressed',
      });
    } else {
      this.prev_move_state = this.move_state;
      this.move_state = nextState;
    }

    this.emitter.emit('move', {
      timestamp: ctime,
      val: nextState,
      normval: Math.round(nextState / 255 * 100) / 100,
      delta: this.move_state - this.prev_move_state,
    });
  }
}

module.exports = SingleAxis;
