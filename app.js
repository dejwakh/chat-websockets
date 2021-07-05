const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const connectedUsers = [];

function timestamp() {
  const today = new Date();
  return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    if (socket.data.username) {
      const idx = connectedUsers.indexOf(socket.data.username);
      connectedUsers.splice(idx, 1)
      console.log(socket.data.username + ' got disconnected');
      console.log(connectedUsers)
      io.emit('user left', socket.data.username, timestamp(), connectedUsers)
    }
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', timestamp(), msg);
  });

  socket.on('register user', (newUser) => {
    if (connectedUsers.includes(newUser)) {
      io.emit('validate user', {
        user: newUser,
        status: false
      })
      socket.disconnect()
    } else {
      io.emit('validate user', {
        user: newUser,
        status: true
      })
      socket.data.username = newUser
      connectedUsers.push(newUser)
      io.emit('user joined', newUser, timestamp(), connectedUsers)
      console.log(connectedUsers)
    }
    
  });

});

server.listen(3000, () => {
  console.log('listening on 3000');
});