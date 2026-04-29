const WebSocket = require('ws')
const Message = require('../models/Message')

// Store connected clients by room
const rooms = new Map()

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server, path: '/api/chat/connect' })

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    const room = url.searchParams.get('room')
    const userId = url.searchParams.get('id')
    const type = url.searchParams.get('type') || 'private'

    if (!room || !userId) {
      ws.close(1008, 'Missing room or id parameter')
      return
    }

    // Store client info
    ws.room = room
    ws.userId = userId
    ws.type = type

    // Add to room
    if (!rooms.has(room)) {
      rooms.set(room, new Set())
    }
    rooms.get(room).add(ws)

    console.log(`User ${userId} connected to room ${room}`)

    // Send first page of history on connect
    sendHistory(ws, room, 1, 5)

    // Handle incoming messages
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString())

        if (message.type === 'getNewMessageList') {
          // Client requesting more history
          const { page, pageSize, room: msgRoom } = message
          await sendHistory(ws, msgRoom || room, page, pageSize)
        } else {
          // Regular chat message - save to DB
          const newMessage = new Message({
            media_type: message.media_type || 'text',
            content: message.content,
            is_sender: message.is_sender || false,
            nickname: message.nickname || '',
            receiver_id: message.receiver_id || '',
            room: message.room || room,
            sender_id: message.sender_id || userId,
            status: message.status || 1,
            type: message.type || 'private',
            avatar: message.avatar || ''
          })
          await newMessage.save()

          // Broadcast to all clients in the room
          const roomClients = rooms.get(room)
          if (roomClients) {
            const broadcastData = JSON.stringify({
              code: 200,
              type: 'other',
              data: newMessage.toObject()
            })
            roomClients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(broadcastData)
              }
            })
          }
        }
      } catch (err) {
        console.error('WebSocket message error:', err.message)
        ws.send(JSON.stringify({ code: 500, message: '消息处理失败' }))
      }
    })

    // Handle disconnect
    ws.on('close', () => {
      const roomClients = rooms.get(room)
      if (roomClients) {
        roomClients.delete(ws)
        if (roomClients.size === 0) {
          rooms.delete(room)
        }
      }
      console.log(`User ${userId} disconnected from room ${room}`)
    })

    ws.on('error', (err) => {
      console.error('WebSocket error:', err.message)
    })
  })

  return wss
}

// Send chat history for a given page
async function sendHistory(ws, room, page, pageSize) {
  try {
    const total = await Message.countDocuments({ room })
    const totalPages = Math.ceil(total / pageSize)

    if (page > totalPages && total > 0) {
      ws.send(JSON.stringify({ code: 404 }))
      return
    }

    // Get messages sorted by created_at descending, then reverse for chronological order
    const messages = await Message.find({ room })
      .sort({ created_at: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()

    if (messages.length === 0) {
      ws.send(JSON.stringify({ code: 404 }))
      return
    }

    // Reverse to chronological order
    messages.reverse()

    ws.send(JSON.stringify({
      code: 200,
      type: 'list',
      historyMsgList: messages
    }))
  } catch (err) {
    console.error('Send history error:', err.message)
    ws.send(JSON.stringify({ code: 500, message: '获取历史消息失败' }))
  }
}

module.exports = { setupWebSocket }
