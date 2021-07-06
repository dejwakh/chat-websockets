const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const connectedUsers = {lobby: []};
let room = "lobby"

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/rooms', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/rooms/:room', (req, res) => {
  room = req.params.room
  if (!connectedUsers.hasOwnProperty(room)) connectedUsers[room] = []
  res.sendFile(__dirname + '/index.html');
});

function timestamp() {
  const today = new Date();
  let hours = today.getHours()
  let minutes = today.getMinutes()
  let seconds = today.getSeconds()
  if (hours < 10) hours = "0" + hours
  if (minutes < 10) minutes = "0" + minutes
  if (seconds < 10) seconds = "0" + seconds
  return '' + hours + ":" + minutes + ":" + seconds + " > ";
}

io.on('connection', (socket) => {
  // a new websocket connection
  socket.join(room)
  socket.data.room = room
  socket.on('register user', (newUser) => {
    if (!newUser || newUser.length < 3 || connectedUsers[socket.data.room].includes(newUser)) {
      io.to(socket.data.room).emit('validate user', {
        user: newUser,
        validated: false
      })
      socket.disconnect()
    } else {
      socket.data.username = newUser
      io.to(socket.data.room).emit('validate user', {
        user: newUser,
        validated: true,
        room
      })
      connectedUsers[socket.data.room].push(newUser)
      io.to(socket.data.room).emit('user joined', newUser, timestamp(), socket.data.room, connectedUsers[socket.data.room])
    }
  });

  socket.on('chat message', (note) => {
    io.to(socket.data.room).emit('chat message', timestamp(), note);
  });

  socket.on('disconnect', () => {
    if (socket.data.username) {
      const idx = connectedUsers[socket.data.room].indexOf(socket.data.username);
      if (idx >= 0) connectedUsers[socket.data.room].splice(idx, 1)
      io.to(socket.data.room).emit('user left', socket.data.username, timestamp(), connectedUsers[socket.data.room])
    }
  });

});

server.listen(3000, () => {
  console.log('listening on 3000');
});