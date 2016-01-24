"use strict";
var five = require("johnny-five");
var http = require("http").createServer(handler);
var io = require("socket.io").listen(http);
var fs = require("fs");
http.listen(3000);
var board = new five.Board();
var servo = {};
board.on("ready", function(){
  servo = {servo: new five.Servo.Continuous(10), lastCounterClockwise: false};
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
    dispense();
  });
});
function dispense(){
  if(servo.lastCounterClockwise){
    servo.servo.cw(1);
  }
  else{
    servo.servo.ccw(1);
  }
  setTimeout(function(){
    servo.servo.stop();
  }, 500);
  servo.lastCounterClockwise = !servo.lastCounterClockwise;
}