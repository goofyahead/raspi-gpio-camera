
var Gpio = require('onoff').Gpio;

var step = new Gpio(23,'out');
var iv;
var stepStatus = 0;
var timestamp = 0;
var count = 0;
var SPEED = 100;

console.log('rotating');

iv = setInterval(function() {
	//console.log('step ' + stepStatus);
	if (count == 100){
		clearInterval(iv);
		count = 0;
		//send sigterm or sigints
		console.log('quiting after loop');
	}

	count++;
	console.log('step');
	step.writeSync(stepStatus === 0 ? 1 : 0); // 1 = on, 0 = off :)
	stepStatus = stepStatus === 0 ? 1 : 0;
}, SPEED);
    