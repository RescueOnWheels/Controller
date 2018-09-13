function SingleAxis(em) {
    this.emitter = em;

    this.move_state = 0;
    this.prev_move_state = 0;

    this.move_start = 0;
    this.move_stop = 0;

    this.event_types = ['move'];
}

SingleAxis.prototype.update = function(next_state) {
    if (this.move_state == next_state) {
        return;
    }

    this.prev_move_state = this.move_state;
    this.move_state = next_state;

    this.emitter.emit('move', {
        timestamp: Date.now(),
        val: next_state,
        normval: next_state / 255,
        delta: this.move_state - this.prev_move_state
    });
}

module.exports = SingleAxis;