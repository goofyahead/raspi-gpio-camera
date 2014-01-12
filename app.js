
var Gpio = require('onoff').Gpio;
var button = new Gpio(17, 'in','falling');
var step = new Gpio(24,'out');
var direction = new Gpio(23,'out');
var iv;
var stepStatus = 0;
var timestamp = 0;
var count = 0;
var SPEED = 5;

console.log('on waiting');

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

    	
	    var raspivid  = spawn('raspivid', ['-n']);

		raspivid.on('close', function (code, signal) {
		  console.log('child process terminated due to receipt of signal '+signal + ' and code ' + code);
		});

  //   	child = exec('raspivid -n -vf -w 1280 -h 720 -fps 30 -o video' + counter + '.h264 -t 20000',
		// function (error, stdout, stderr) {
		//     console.log('stdout: ' + stdout);
		//     console.log('stderr: ' + stderr);
		//     if (error !== null) {
		//       console.log('exec error: ' + error);
		//     }
		// });

		count++;

	    iv = setInterval(function() {
	    	//console.log('step ' + stepStatus);
	    	if (count == 3201){
	    		clearInterval(iv);
	    		count = 0;
	    		//send sigterm or sigints
	    		raspivid.kill();

	    		console.log('quiting after loop');
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