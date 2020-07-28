require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

const morgan = require('morgan')
const cors = require('cors')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(cors())
app.use(morgan('tiny'))

// routes
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

// sockets
io.on('connection', socket => {
  console.log('socket connect')
  socket.on('join-room', (roomId, userId) => {
    console.log({ roomId, userId })
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
  })

  socket.on('disconnect', () => {
    console.log('socket disconnect')
  })
})

const port = process.env.PORT || 3000

server.listen(port, () => console.log(`Listening on port: ${port}`))
