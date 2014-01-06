var Gpio = require('onoff').Gpio,
    button = new Gpio(11, 'in', 'both');

console.log('on waiting');

button.watch(function(err, value) {
    if (err) exit();
    console.log('button pressed!');
});

function exit() {
	console.log('quitting');
    button.unexport();
    process.exit();
}

process.on('SIGINT', exit);