
var Gpio = require('onoff').Gpio;

var step = new Gpio(23,'out');
var iv;
var timestamp = 0;
var count = 0;
var SPEED = 30;

console.log('rotating');
step.writeSync(0);

iv = setInterval(function() {
	if (count == 400){
		clearInterval(iv);
		count = 0;
		//send sigterm or sigints
		console.log('quiting after loop');
	}

	count++;
	console.log('step');
	step.writeSync(1); // 1 = on, 0 = off :)
	step.writeSync(0);
}, SPEED);
    
