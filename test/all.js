const SteamController = require('./../');

const controller = new SteamController();

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

controller.connect();
