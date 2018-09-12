var SteamController = require('./');
var controller = new SteamController();

controller.x.on('press', function(event) {
    console.log('X button pressed down at', event.timestamp);
});

controller.b.on('release', function(event) {
    console.log('B button held down for', event.duration, 'ms');
});

controller.stick.on('move', function(event) {
    console.log('stick moved to', event.x, event.y);
});

controller.rpad.on('touch', function(event) {
    console.log("the right pad was touched at", event.x, event.y);
});

controller.connect();