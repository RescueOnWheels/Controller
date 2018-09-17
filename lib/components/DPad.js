class DPad {
  constructor(em) {
    this.emitter = em;
    this.event_types = [
      'up press', 'up release',
      'down press', 'down release',
      'left press', 'left release',
      'right press', 'right release',
    ];

    this.state = {
      up: {
        state: 0,
        release_time: 0,
        press_time: 0,
      },
      down: {
        state: 0,
        release_time: 0,
        press_time: 0,
      },
      left: {
        state: 0,
        release_time: 0,
        press_time: 0,
      },
      right: {
        state: 0,
        release_time: 0,
        press_time: 0,
      },
    };

    this.press_time = 0;
    this.release_time = 0;
  }

  updateGeneric(id, nextState) {
    if (this.state[id].state === nextState) {
      return;
    }

    if (this.state[id].state === 0 && nextState === 1) {
      this.state[id].press_time = Date.now();
      this.state[id].state = nextState;

      this.emitter.emit(`${id} press`, {
        timestamp: this.state[id].press_time,
      });
    } else {
      this.state[id].release_time = Date.now();
      this.state[id].state = nextState;

      this.emitter.emit(`${id} release`, {
        timestamp: this.state[id].release_time,
        duration: this.state[id].release_time - this.state[id].press_time,
      });
    }
  }

  update(up, down, left, right) {
    this.updateGeneric('up', up);
    this.updateGeneric('down', down);
    this.updateGeneric('left', left);
    this.updateGeneric('right', right);
  }
}

module.exports = DPad;
