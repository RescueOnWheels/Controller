const SteamController = require('./../');

const controller = new SteamController();

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

controller.connect();
