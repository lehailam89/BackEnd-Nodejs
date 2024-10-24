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

    //khi A gửi data lên server, server chỉ trả về cho A
    //Ví dụ: Khi A gửi tin nhắn nhưng bị lỗi, server chỉ trả về cho A
    //socket.emit("SERVER_RETURN_MESSAGE", data);

    //Khi A gửi data lên server, server trả về cho cả B, C, D,...
    //Ví dụ: Tin nhắn chat
    io.emit("SERVER_RETURN_MESSAGE", data);

    //Khi A gửi data lên server, server trả về cho cả B, C, D,... nhưng không trả về cho A
    //Ví dụ: Typing...(dấu 3 chấm nháy nháy khi đang nhắn tin)
    //socket.broadcast.emit("SERVER_RETURN_MESSAGE", data);
    });
});

server.listen(3003, () => {
  console.log('listening on *:3003');
});