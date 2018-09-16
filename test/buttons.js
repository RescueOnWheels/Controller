const SteamController = require('./../');

const controller = new SteamController();
const presses = [
  'x',
  'y',
  'a',
  'b',
  'home',
  'back',
  'forward',
  'ltrigger',
  'rtrigger',
  'lgrip',
  'rgrip',
  'lshoulder',
  'rshoulder',
  'stick',
  // 'lpad',
  'rpad',
];

presses.forEach((name) => {
  controller[name].on('press', (ev) => {
    console.log(name, 'press', ev);
  });
});

controller.connect();
