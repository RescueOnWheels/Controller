const SteamController = require('./../');

const controller = new SteamController();

controller.rtrigger.on('move', (event) => {
  const json = JSON.stringify(event, null, 4);

  console.log(json);
  console.log();
});

controller.connect();
