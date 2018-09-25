const SteamController = require('./../'); // Replace `require('./')` with require('node-steam-controller')

const controller = new SteamController();

controller.x.on('press', (event) => {
  console.log('X button pressed down at', event.timestamp);
});

controller.b.on('release', (event) => {
  console.log('B button held down for', event.duration, 'ms');
});

controller.stick.on('move', (event) => {
  console.log('stick moved to', event.x, event.y);
});

controller.rpad.on('touch', (event) => {
  console.log('the right pad was touched at', event.x, event.y);
});

controller.connect();
