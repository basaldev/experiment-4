const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);
const port = process.env.PORT;

app.use('/', express.static(__dirname + '/static'));

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('camera-rotation', function(rotation) {
    socket.broadcast.emit('monitor', rotation);
  });

  socket.on('remote', function(channel, data1, data2) {
    socket.broadcast.emit('main', channel, data1, data2);
  });

  socket.on('vr-loaded', function() {
    console.log('vr connected');
    socket.broadcast.emit('device-ready', 'vr');
  });

  socket.on('controller-loaded', function(channel) {
    console.log(channel + 'controller connected');
    socket.broadcast.emit('device-ready', channel);
  });

  socket.on('controller-reseted', function() {
    console.log('controller reseted');
    socket.broadcast.emit('reset');
  });
});

if (port) {
  server.listen(port, () => {
    console.log('Server started on ' + port)
  });
} else {
  server.listen();
}

