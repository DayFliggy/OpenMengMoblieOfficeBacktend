const WebSocket = require('ws')
const jwt = require('jsonwebtoken')
const Message = require('../models/Message')
const User = require('../models/User')
const Room = require('../models/Room')
const { JWT_SECRET } = require('../middleware/auth')

// Store connected clients by room
const rooms = new Map()

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server, path: '/api/chat/connect' })

  wss.on('connection', async (ws, req) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`)
      const room = url.searchParams.get('room')
      const token = url.searchParams.get('token')

      if (!room || !token) {
        ws.close(1008, 'Missing room or token parameter')
        return
      }

      // JWT 认证
      let decoded
      try {
        decoded = jwt.verify(token, JWT_SECRET)
      } catch (err) {
        ws.close(1008, 'Invalid or expired token')
        return
      }

      const userId = decoded.userid
      const user = await User.findOne({ userid: userId }).lean()
      if (!user) {
        ws.close(1008, 'User not found')
        return
      }

      // 验证房间成员
      const roomDoc = await Room.findOne({ room_id: room, 'members.user_id': userId })
      if (!roomDoc) {
        ws.close(1008, 'Not a member of this room')
        return
      }

      // 存储客户端信息
      ws.room = room
      ws.userId = userId
      ws.type = roomDoc.type

      // 加入房间
      if (!rooms.has(room)) {
        rooms.set(room, new Set())
      }
      rooms.get(room).add(ws)

      console.log(`User ${userId} connected to room ${room}`)

      // 更新已读标记
      await Room.updateOne(
        { room_id: room, 'members.user_id': userId },
        { $set: { 'members.$.last_read_at': new Date() } }
      )

      // 连接时发送第一页历史消息
      sendHistory(ws, room, 1, 5)

      // 处理收到的消息
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString())

          if (message.type === 'getNewMessageList') {
            // 客户端请求更多历史消息
            const { page, pageSize, room: msgRoom } = message
            await sendHistory(ws, msgRoom || room, page, pageSize)
          } else {
            // 普通聊天消息 — 保存到数据库
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

            // 更新房间最后消息
            await Room.updateOne(
              { room_id: room },
              {
                last_message: message.content ? message.content.substring(0, 100) : '',
                last_message_time: newMessage.createdAt
              }
            )

            // 广播给房间内所有客户端
            const roomClients = rooms.get(room)
            if (roomClients) {
              roomClients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                  const msgObj = newMessage.toObject()
                  // 为每个客户端单独计算 is_sender
                  msgObj.is_sender = (msgObj.sender_id === client.userId)
                  client.send(JSON.stringify({
                    code: 200,
                    type: 'other',
                    data: msgObj
                  }))
                }
              })
            }
          }
        } catch (err) {
          console.error('WebSocket message error:', err.message)
          ws.send(JSON.stringify({ code: 500, message: '消息处理失败' }))
        }
      })

      // 断开连接
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
    } catch (err) {
      console.error('WebSocket connection error:', err.message)
      ws.close(1011, 'Internal server error')
    }
  })

  return wss
}

// 发送指定页的历史消息
async function sendHistory(ws, room, page, pageSize) {
  try {
    const total = await Message.countDocuments({ room })
    const totalPages = Math.ceil(total / pageSize)

    if (page > totalPages && total > 0) {
      ws.send(JSON.stringify({ code: 404 }))
      return
    }

    const messages = await Message.find({ room })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()

    if (messages.length === 0) {
      ws.send(JSON.stringify({ code: 404 }))
      return
    }

    // 反转为时间正序
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
