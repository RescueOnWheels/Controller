const SteamController = require('./../');

const controller = new SteamController();

[
  'ltrigger',
  'rtrigger',
].forEach((name) => {
  [
    'move',
  ].forEach((type) => {
    controller[name].on(type, (ev) => {
      console.log(name, type, ev.normval);
    });
  });
});

controller.connect();
