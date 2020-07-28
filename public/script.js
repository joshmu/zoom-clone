// @ts-nocheck
const socket = io('/')

// ROOM_ID is created server side and passed via ejs
socket.emit('join-room', ROOM_ID, 10)

socket.on('user-connected', userId => {
  console.log(`${userId} joins the room`)
})

socket.on('connection', (roomId, userId) => {
  console.log({ roomId, userId })
})
