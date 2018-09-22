const controller = require('./../');

/**
 * Can't use `controller.connect` inside of the `error` event,
 * else emitting won't work.
 */
function connect() {
  controller.connect();
}

controller.on('error', (err) => {
  /**
   * Error code 404 is only thrown if the Steam Controller is not found;
   * Ignoring the error message because we know what it will be.
   */
  if (err.code !== 404) {
    console.log(err);
  }

  /**
   * Attempt re-connecting to the Steam Controller.
   */
  setTimeout(connect, 1000);
});

[
  'lpad',
  'rpad',
].forEach((name) => {
  [
    'touch',
    'untouch',
  ].forEach((type) => {
    controller[name].on(type, (ev) => {
      console.log(name, type, ev);
    });
  });
});

/**
 * Graceful shutdown of HID.
 */
process.on('SIGINT', () => {
  controller.disconnect();
});

connect();
