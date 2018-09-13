class SingleAxis {
  constructor(em) {
    this.emitter = em;
    this.event_types = ['move'];

    this.move_state = 0;
    this.prev_move_state = 0;
    this.move_start = 0;
    this.move_stop = 0;
  }

  update(nextState) {
    if (this.move_state === nextState) {
      return;
    }

    this.prev_move_state = this.move_state;
    this.move_state = nextState;

    this.emitter.emit('move', {
      timestamp: Date.now(),
      val: nextState,
      normval: nextState / 255,
      delta: this.move_state - this.prev_move_state,
    });
  }
}

module.exports = SingleAxis;
