
var Gpio = require('onoff').Gpio;
var button = new Gpio(17, 'in','falling');
var step = new Gpio(24,'out');
var direction = new Gpio(23,'out');
var iv;
var stepStatus = 0;

console.log('on waiting');

button.watch(function(err, value) {
    if (err) exit();
    console.log('button pressed!');

    iv = setInterval(function() {
    	step.writeSync(stepStatus === 0 ? 1 : 0); // 1 = on, 0 = off :)
    	stepStatus = stepStatus === 0 ? 1 : 0;
	}, 200);
	
});

function exit() {
	console.log('quitting');
    button.unexport();
    process.exit();
}

process.on('SIGINT', exit);