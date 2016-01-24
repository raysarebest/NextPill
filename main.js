"use strict";
var five = require("johnny-five");
var http = require("http").createServer(handler);
var io = require("socket.io").listen(http);
var fs = require("fs");
http.listen(3000);
var board = new five.Board();
var servo = {};
board.on("ready", function(){
  servo = new five.Servo.Continuous(10);
});
function handler (req, res) {
  fs.readFile(__dirname + '/index.html', function(err, data){
    if(err){
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
}
io.sockets.on('connection', function (socket){
  socket.on('servo', function(data){
    repeat(dispense);
  });
  socket.on("time", function(data){
    repeat(function(){
      dispenseWithInterval(data.milliseconds);
    })
  })
});
function dispense(){
  // if(servo.lastCounterClockwise){
  //   servo.servo.cw(1);
  // }
  // else{
  //   servo.servo.ccw(1);
  // }
  // setTimeout(function(){
  //   servo.servo.stop();
  //   servo.lastCounterClockwise = !servo.lastCounterClockwise;
  // }, 500);
  servo.cw(1);
  setTimeout(function(){
    servo.stop();
    setTimeout(function(){
      servo.ccw(1);
      setTimeout(function(){
        servo.stop();
      }, 480)
    }, 250);
  }, 500);
}
function dispenseWithInterval(interval){
  if(!dispenseWithInterval.lastID === undefined){
    clearInterval(dispenseWithInterval.lastID);
  }
  dispenseWithInterval.lastID = setInterval(dispense, interval);
}
function repeat(func){
  for(var i = 0; i < 2; ++i){
    func();
  }
}