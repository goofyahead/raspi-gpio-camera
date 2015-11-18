
var Gpio = require('onoff').Gpio;

var step = new Gpio(23,'out');
var button = new Gpio(24,'in','falling');
var colors = require('colors');
var timestamp = 0;
var count = 0;
var SPEED = 30;

var request = require('request');
var FormData = require('form-data');
var http = require('http');
var fs = require('fs');
var path = require('path');
http.post = require('http-post');
var uuid = require('node-uuid');

console.log('on waiting for first pulse...'.yellow);

// var exec = require('child_process').exec,
//     child;
var spawn = require('child_process').spawn;

var counter = 0;
var status = 0;
var HOST = 'http://kaprika.ngrok.io';

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

        // take picture when finished record video
        var takePicture = spawn('raspistill', ['-w','1280','-h','720','-o', 'picture.jpg']);

        takePicture.on('close', function (code, signal) {
            console.log('picture taken now take video');

            var raspivid  = spawn('raspivid', ['-n',
            '-o', 'first.h264',
            '-i', 'pause',
            '-td', '30000,2900',
            '-w', '1280',
            '-h', '720',
            '-fps', '25']);

        raspivid.on('close', function (code, signal) {
            console.log('child process terminated due to receipt of signal '+signal + ' and code ' + code);
            // here we can launch raspiStill
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
                if (count == 410){
                    console.log('video of ' + (new Date().getTime() - startedVideo));
                    clearInterval(iv);
                    count = 0;
                    //send sigterm or sigints
                    raspivid.kill();
                    //button.unexport();
                    //process.exit();
                    console.log('WAITING FOR NEXT VIDEO TO BE RECORDED'.green);

                    console.log('UPLOADING NOW TO :'.green + HOST + '/api/video-upload');

                    var r = request.post({
                            url : HOST + '/api/video-upload'
                        },
                        function optionalCallback (err, httpResponse, body) {
                            if (err) {
                                return console.error('upload failed:', err);
                            }
                            console.log('Upload successful!  Server responded with:', body);
                        }
                    );
                    
                    var form = r.form();
                    form.append('uploadPicture', fs.createReadStream(path.join(__dirname, 'picture.jpg')));
                    form.append('filename', 'auto_' + uuid.v4());
                    form.append('uploadingVideo', fs.createReadStream(path.join(__dirname, 'first.h264')));
                }

                count++;
		//console.log('step' + status);
                step.writeSync(status == 1 ? 0 : 1); // 1 = on, 0 = off :)
                status = status == 1 ? 0 : 1;
            }, SPEED);

        },3000);

        });
    }
});
