
var Gpio = require('onoff').Gpio;
var button = new Gpio(17, 'in','falling');
var step = new Gpio(24,'out');
var direction = new Gpio(23,'out');
var iv;
var stepStatus = 0;
var timestamp = 0;
var count = 0;
var SPEED = 10;

console.log('on waiting');

var exec = require('child_process').exec,
    child;

var counter = 0;

button.watch(function(err, value) {
    if (err) exit();
    //start camera in pause mode, wait for it starts
	child = exec('raspivid -n -vf -w 1280 -h 720 -fps 30 -s -o video' + counter + '.h264 -t 30000',
	  function (error, stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	});
    //send sigusr1
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
	    		//send sigterm or sigint
	    		child.kill('SIGTERM');
	    	}

	    	count++;
	    	step.writeSync(stepStatus === 0 ? 1 : 0); // 1 = on, 0 = off :)
	    	stepStatus = stepStatus === 0 ? 1 : 0;
		}, SPEED);
    }
});

function exit() {
	console.log('quitting');
	clearInterval(iv);
    button.unexport();
    process.exit();
}

process.on('SIGINT', exit);