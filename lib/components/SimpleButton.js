class SimpleButton {
  constructor(em) {
    this.emitter = em;
    this.event_types = ['press', 'release'];

    this.state = 0;
    this.press_time = 0;
    this.release_time = 0;
  }

  update(nextState) {
    if (this.state === nextState) {
      return;
    }
    if (this.state === 0 && nextState === 1) {
      this.press_time = Date.now();
      this.state = nextState;

      this.emitter.emit('press', {
        timestamp: this.press_time,
      });
    } else {
      this.release_time = Date.now();
      this.state = nextState;

      this.emitter.emit('release', {
        timestamp: this.release_time,
        duration: this.release_time - this.press_time,
      });
    }
  }
}

module.exports = SimpleButton;
