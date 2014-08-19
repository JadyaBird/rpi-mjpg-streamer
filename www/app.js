var express = require('express');
var app = express();
var server = require('http').createServer(app);
var fs = require('fs');
var WebSocketServer = require('websocket').server;
var piblaster = require("pi-blaster.js");



var clients = [ ];

//Getting request from browser
//and send response back
app.get ('/', function(req, res){    

      fs.readFile('index.html', 'utf8', function(err, text){
            res.send(text);
        });
});

//Listening to Port 1337 for incoming messages
server.listen(1337, function (){
    console.log((new Date()) + " Server is listening on port 1337... ");
});

websock = new WebSocketServer({
    httpServer: server
});

//WebSocket Server

websock.on('request', function(request) {
    
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin);
    
    console.log((new Date()) + ' Connection accepted.');

    //Incoming Data handling
    connection.on('message', function(message) {

        console.log('Data: ' +  message.utf8Data);
   
        var data = message.utf8Data;
        data = data.slice(1,3);

        // If incoming data is > 2 send a signal to pin 17
        // Set GPIO pin 4 to a PWM of 24%
        // Turns the Servo to it's right
        if (Number(data)>0){        
            piblaster.setPwm(17, 0.9);
			console.log("Data > 0" +data);

        }

        // If incoming data is > 2 send a signal to pin 17
        // Set GPIO pin 4 to a PWM of 6%
        // Turns the Servo to it's left
        if (Number(data)<(0)){        
            piblaster.setPwm(17, 0.05);
			console.log("Data < 0" + data);

        }

        // If incoming data is > 2 send a signal to pin 17
        // Set GPIO pin 4 to a PWM of 15%
        // Turns the Servo to it's center position
        if (Number(data)==0){        
            piblaster.setPwm(17, 0.5);
			console.log("data == 0" +data);
        }

    });
    
    connection.on('close', function (connection){
        //close connection
        piblaster.setPwm(17, 0);
		console.log("Connection": + connection);
    });

    function closePin(){
        piblaster.setPwm(17, 0);

    }

});
