# chat-websockets

## What is it?
A basic unsecure, public chatroom to test [socket.io](https://socket.io/get-started/chat) with several features:

1. a way to capture and save the username of every client that connects to the server,
2. A notification system that announces to all clients whenever a user enters or leaves the chat, as well as a report of all the users still connected
3. A way to make sure the same user isn’t logged in twice (and not allow the second attempt)
4. Ability to log in to different rooms

## Built using:
1. Express + Node
2. socket.io

## To test locally:
1. Download the repo & run `npm i`
2. Run `node server.js`
3. Go to `localhost:3000` on several different browser tabs, "logging in" as different usernames on each one
4. Send a message from any tab and see it appear on the others
5. To test the rooms feature, go to `localhost:3000/rooms/room_name` and replace `room_name` with whatever room you want to create

## Only two noteworthy files:
1. The Express server is contained in `server.js`
2. The client is contained in `client.html` (including JS)