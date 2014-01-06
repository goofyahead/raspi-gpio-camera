var Gpio = require('onoff').Gpio,
    button = new Gpio(0, 'in', 'both');

button.watch(function(err, value) {
    if (err) exit();
    console.log('button pressed!');
});

function exit() {
    led.unexport();
    button.unexport();
    process.exit();
}

process.on('SIGINT', exit);