
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
    var timeStamp1delay;
    var startedVideo;
    if (current - timestamp > 300){
    	timestamp = current;
    	console.log('button pressed! ' + current);

		var raspivid  = spawn('raspivid', ['-n', 
    			'-o', 'first.h264', 
    			'-i', 'pause', 
    			'-td', '30000,2900',
	    		'-w', '1280', 
	    		'-h', '720',
                '-fps', '25',
                '-awb', 'off',
                '-awbg', '1.5,1.2',
                '-ISO', '100',
                '-ss', '10000',
	    		'-vf']);

		raspivid.on('close', function (code, signal) {
			console.log('child process terminated due to receipt of signal '+signal + ' and code ' + code);
        });

    	setTimeout(function () {
    		console.log('starting delayed video.');
    		timeStamp1delay = new Date().getTime();
    		console.log('elapsed: ' + ( timeStamp1delay - current));
    		

    		var iv = setInterval(function() {
    			if (count == 0) {
    				startedVideo = new Date().getTime();
    				console.log('elapsed: ' + (startedVideo - timeStamp1delay));
    			}
		    	if (count == 420){
		    		console.log('video of ' + (new Date().getTime() - startedVideo));
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

    	},3000);
    }
});