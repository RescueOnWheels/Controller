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
  if (err.code !== 'ERR_STEAM_CONTROLLER_NOT_FOUND') {
    console.log(err);
  }

  /**
   * Attempt re-connecting to the Steam Controller.
   */
  setTimeout(connect, 1000);
});

const presses = [
  'x',
  'y',
  'a',
  'b',
  'prev',
  'home',
  'next',
  'ltrigger',
  'rtrigger',
  'lgrip',
  'rgrip',
  'lshoulder',
  'rshoulder',
  'stick',
  'lpad',
  'rpad',
];

presses.forEach((name) => {
  controller[name].on('press', (ev) => {
    console.log(name, 'press', ev);
  });

  controller[name].on('release', (ev) => {
    console.log(name, 'release', ev);
  });
});

[
  'ltrigger',
  'rtrigger',
  'stick',
  'lpad',
  'rpad',
].forEach((name) => {
  [
    'move start',
    'move stop',
    'move',
  ].forEach((type) => {
    controller[name].on(type, (ev) => {
      console.log(name, type, ev);
    });
  });
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
[
  'SIGINT',
  'SIGTERM',
].forEach((event) => {
  process.on(event, () => {
    controller.disconnect();
    process.exit(0);
  });
});

connect();
