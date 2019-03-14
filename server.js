const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);
const port = 3000;

app.use('/', express.static( __dirname + '/static'));

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('remote', function(channel, data) {
    socket.broadcast.emit('main', channel, data);
    // console.log('##', data);
  });
});

server.listen(port, () => {
  console.log('Server started')
});
