const SteamController = require('./../');

const controller = new SteamController();

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
