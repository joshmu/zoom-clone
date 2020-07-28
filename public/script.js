// @ts-nocheck
const socket = io('/')
const videoGrid = document.getElementById('video-grid')

const peer = new Peer(undefined, {
  host: '/',
  port: 3001,
})

const myVideo = document.createElement('video')
myVideo.muted = true

const peers = {}

const videoStream = navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then(stream => {
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
      call.answer(stream)
      const videoElem = document.createElement('video')
      call.on('stream', stream => addVideoStream(videoElem, stream))
      call.on('close', () => videoElem.remove())
    })

    socket.on('user-connected', userId => {
      console.log(`user connected: ${userId}`)
      connnectToNewUser(userId, stream)
    })
    socket.on('user-disconnected', userId => {
      console.log(`user disconnected: ${userId}`)
      if (peers[userId]) peers[userId].close()
    })
  })

peer.on('open', peerId => {
  console.log(`My peer ID is: ${peerId}`)

  // ROOM_ID is created server side and passed via ejs
  socket.emit('join-room', ROOM_ID, peerId)
})

function connnectToNewUser(userId, stream) {
  const call = peer.call(userId, stream)
  const videoElem = document.createElement('video')
  call.on('stream', stream => addVideoStream(videoElem, stream))
  call.on('close', () => videoElem.remove())
  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}
