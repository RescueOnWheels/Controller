const SteamController = require('./../');

const controller = new SteamController();

[
  'stick',
].forEach((name) => {
  [
    'move',
  ].forEach((type) => {
    controller[name].on(type, (ev) => {
      const json = JSON.stringify(ev, null, 4);

      console.log(json);
      console.log();
    });
  });
});

controller.connect();
