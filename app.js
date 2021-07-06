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
  let hours = today.getHours()
  let minutes = today.getMinutes()
  let seconds = today.getSeconds()
  if (hours < 10) hours = "0" + hours
  if (minutes < 10) minutes = "0" + minutes
  if (seconds < 10) seconds = "0" + seconds
  return hours + ":" + minutes + ":" + seconds + " > ";
}

io.on('connection', (socket) => {
  // a new websocket connection

  socket.on('disconnect', () => {
    if (socket.data.username) {
      const idx = connectedUsers.indexOf(socket.data.username);
      connectedUsers.splice(idx, 1)
      io.emit('user left', socket.data.username, timestamp(), connectedUsers)
    }
  });

  socket.on('chat message', (note) => {
    io.emit('chat message', timestamp(), note);
  });

  socket.on('register user', (newUser) => {
    if (connectedUsers.includes(newUser)) {
      io.emit('validate user', {
        user: newUser,
        validated: false
      })
      socket.disconnect()
    } else {
      socket.data.username = newUser
      io.emit('validate user', {
        user: newUser,
        validated: true
      })
      connectedUsers.push(newUser)
      io.emit('user joined', newUser, timestamp(), connectedUsers)
    }
    
  });

});

server.listen(3000, () => {
  console.log('listening on 3000');
});