# chat-websockets

## What is it?
A basic unsecure, public chatroom to test [socket.io](https://socket.io/get-started/chat) with several features:

1. a way to capture and save the username of every client that connects to the server,
2. A notification system that announces to all clients whenever a user enters or leaves the chat, as well as a report of all the users still connected
3. A way to make sure the same user isn’t logged in twice (and not allow the second attempt)

## Built using:
1. Express.js
2. socket.io

## To test:
1. Download the repo
2. Run `node app.js`
3. Go to `localhost:3000` on several browsers, logging as different usernames on each one
