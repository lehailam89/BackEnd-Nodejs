const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.emit("SERVER_SEND_SOCKET_ID", socket.id);

  socket.on("CLIENT_SEND_MESSAGE", (data) => {
    
    io.emit("SERVER_RETURN_MESSAGE", data);
    });
});

server.listen(3003, () => {
  console.log('listening on *:3003');
});