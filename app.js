
var Gpio = require('onoff').Gpio;

var step = new Gpio(23,'out');
var button = new Gpio(24,'in','falling');
var timestamp = 0;
var count = 0;
var SPEED = 30;

console.log('on waiting...');

// var exec = require('child_process').exec,
//     child;
var spawn = require('child_process').spawn;

var counter = 0;

button.watch(function(err, value) {
	if (err) exit();
    //start camera in pause mode, wait for it starts

    //send sigusr1
    var current = new Date().getTime();
    if (current - timestamp > 300){
    	timestamp = current;
    	console.log('button pressed!');

    	//setTimeout(function () {
    		console.log('starting delayed video.');
    		var raspivid  = spawn('raspivid', ['-n', 
    			'-o', 'first.h264', 
    			'-i', 'pause', 
    			'-td', '20000,600',
	    	//'-t', '20000',
	    	'-w', '1280', 
	    	'-h', '720', 
	    	'-fps', '30', 
	    	'-vf']);

    		raspivid.on('close', function (code, signal) {
    			console.log('child process terminated due to receipt of signal '+signal + ' and code ' + code);
    		});

    		var iv = setInterval(function() {
		    	//console.log('step ' + stepStatus);
		    	if (count == 420){
		    		clearInterval(iv);
		    		count = 0;
		    		//send sigterm or sigints
		    		raspivid.kill();
		    		button.unexport();
		    		//process.exit();
		    		console.log('quiting after loop');
		    	}

		    	count++;
		    	step.writeSync(1); // 1 = on, 0 = off :)
    			step.writeSync(0);
    		}, SPEED);

    	//},1000);
    }
});