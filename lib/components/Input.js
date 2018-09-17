const EventEmitter = require('events');

class Input {
  constructor(...types) {
    this.emitter = new EventEmitter();
    this.events = {};
    this.components = {};

    const that = this;
    types.forEach((Type) => {
      const tobj = new Type(that.emitter);
      tobj.event_types.forEach((ev) => {
        that.events[ev] = tobj;
      });

      that.components[tobj.constructor.name] = tobj;
    });
  }

  on(event, listener) {
    if (Object.keys(this.events).indexOf(event) === -1) {
      return;
    }

    this.emitter.addListener(event, listener);
  }

  update(id, ...args) {
    this.components[id].update(...args);
  }
}

module.exports = Input;
