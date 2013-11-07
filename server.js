var express = require('express'),
    app     = express(),
    http    = require('http'),
    server  = http.createServer(app),
    io      = require('socket.io').listen(server),
    _       = require("underscore");

// listen for new web clients:
server.listen(3000);

app.use(express.static(__dirname + '/public'));

// Routage
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var connected_users = [];

io.sockets.on('connection', function(socket){
  console.log("un utilisateur vient de se connecter");

  socket.on('adduser', function(pseudo){
    socket.pseudo = pseudo;
    connected_users.push(socket.pseudo);
    io.sockets.emit('updateusers', connected_users);
  });

  socket.on('sendchat', function(message){
    io.sockets.emit('updatechat', socket.pseudo, message);
  });

  socket.on('disconnect', function(){
    connected_users = _.without(connected_users, socket.pseudo);
    io.sockets.emit('updateusers', connected_users);
  });
});