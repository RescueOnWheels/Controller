const SteamController = require('./../');

const controller = new SteamController();

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

controller.connect();
