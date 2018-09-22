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
  'up',
  'down',
  'left',
  'right',
].forEach((name) => {
  controller.lpad.on(`${name} press`, (ev) => {
    console.log('lpad press', name, ev);
  });

  controller.lpad.on(`${name} release`, (ev) => {
    console.log('lpad releases', name, ev);
  });
});

/**
 * Graceful shutdown of HID.
 */
process.on('SIGINT', () => {
  controller.disconnect();
});

connect();
