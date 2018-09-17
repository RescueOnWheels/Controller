const SteamController = require('./../');

const controller = new SteamController();

const presses = [
  'a',
  'b',
  'x',
  'y',
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

controller.connect();
