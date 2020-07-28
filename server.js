require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http')
const server = new http.Server(app)

const io = require('socket.io')(server)
const uuid = require('uuid')

const morgan = require('morgan')
const cors = require('cors')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuid.v4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

app.use(cors())
app.use(morgan('tiny'))

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port: ${port}`))
