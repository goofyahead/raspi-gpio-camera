
var Gpio = require('onoff').Gpio;
var button = new Gpio(17, 'in','falling');
var step = new Gpio(24,'out');
var direction = new Gpio(23,'out');
var iv;
var stepStatus = 0;
var timestamp = 0;
var count = 0;

console.log('on waiting');

button.watch(function(err, value) {
    if (err) exit();
    var current = new Date().getTime();
    if (current - timestamp > 300){
    	timestamp = current;
    	console.log('button pressed!');

    	console.log('done!');

	    iv = setInterval(function() {
	    	//console.log('step ' + stepStatus);
	    	if (count == 3201){
	    		clearInterval(iv);
	    		count = 0;
	    		console.log('quiting after loop');
	    	}

	    	count++;
	    	step.writeSync(stepStatus === 0 ? 1 : 0); // 1 = on, 0 = off :)
	    	stepStatus = stepStatus === 0 ? 1 : 0;
		}, 1);
    }
});

function exit() {
	console.log('quitting');
	clearInterval(iv);
    button.unexport();
    process.exit();
}

process.on('SIGINT', exit);