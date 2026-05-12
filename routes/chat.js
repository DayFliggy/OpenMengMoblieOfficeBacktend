const express = require('express')
const Room = require('../models/Room')
const Message = require('../models/Message')
const User = require('../models/User')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// POST /api/mobile_officing/chat/room — 创建或获取房间
router.post('/room', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userid
    const { type, targetUserId, name, memberIds } = req.body

    if (!type || !['private', 'group'].includes(type)) {
      return res.json({ code: 400, message: '聊天类型无效' })
    }

    if (type === 'private') {
      if (!targetUserId) {
        return res.json({ code: 400, message: '缺少目标用户ID' })
      }
      if (targetUserId === userId) {
        return res.json({ code: 400, message: '不能和自己聊天' })
      }

      // 查询是否已存在私聊房间
      const existingRoom = await Room.findOne({
        type: 'private',
        'members.user_id': { $all: [userId, targetUserId] }
      }).lean()

      if (existingRoom) {
        return res.json({ code: 200, message: '获取成功', data: existingRoom })
      }

      // 查找目标用户信息
      const targetUser = await User.findOne({ userid: targetUserId }).lean()
      if (!targetUser) {
        return res.json({ code: 404, message: '目标用户不存在' })
      }

      // 查找当前用户信息
      const currentUser = await User.findOne({ userid: userId }).lean()

      const room = await Room.create({
        type: 'private',
        members: [
          {
            user_id: userId,
            nickname: currentUser.nickname || '',
            avatar: currentUser.avatar || '',
            role: 'owner',
            joined_at: new Date(),
            last_read_at: new Date()
          },
          {
            user_id: targetUserId,
            nickname: targetUser.nickname || '',
            avatar: targetUser.avatar || '',
            role: 'member',
            joined_at: new Date(),
            last_read_at: new Date()
          }
        ],
        created_by: userId
      })

      return res.json({ code: 200, message: '创建成功', data: room })
    }

    // 群聊
    if (!name) {
      return res.json({ code: 400, message: '缺少群聊名称' })
    }
    if (!Array.isArray(memberIds) || memberIds.length === 0) {
      return res.json({ code: 400, message: '缺少群成员' })
    }

    // 去重并加入当前用户
    const uniqueMemberIds = [...new Set([userId, ...memberIds])]

    // 批量查找成员信息
    const users = await User.find({ userid: { $in: uniqueMemberIds } }).lean()
    const userMap = new Map(users.map(u => [u.userid, u]))

    const members = uniqueMemberIds.map((id, index) => {
      const user = userMap.get(id)
      return {
        user_id: id,
        nickname: user ? (user.nickname || '') : '',
        avatar: user ? (user.avatar || '') : '',
        role: id === userId ? 'owner' : 'member',
        joined_at: new Date(),
        last_read_at: new Date()
      }
    })

    const room = await Room.create({
      type: 'group',
      name,
      members,
      created_by: userId
    })

    return res.json({ code: 200, message: '创建成功', data: room })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

// GET /api/mobile_officing/chat/rooms — 会话列表
router.get('/rooms', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userid
    const { page = 1, pageSize = 20 } = req.query
    const pageNum = parseInt(page)
    const size = parseInt(pageSize)

    const filter = { 'members.user_id': userId }
    const total = await Room.countDocuments(filter)
    const rooms = await Room.find(filter)
      .sort({ last_message_time: -1 })
      .skip((pageNum - 1) * size)
      .limit(size)
      .lean()

    // 为每个房间计算未读数和显示信息
    const items = await Promise.all(rooms.map(async (room) => {
      const currentMember = room.members.find(m => m.user_id === userId)
      const lastReadAt = currentMember ? currentMember.last_read_at : new Date(0)

      const unreadCount = await Message.countDocuments({
        room: room.room_id,
        createdAt: { $gt: lastReadAt }
      })

      // 私聊显示对方信息
      let displayName = room.name
      let displayAvatar = room.avatar
      if (room.type === 'private') {
        const otherMember = room.members.find(m => m.user_id !== userId)
        if (otherMember) {
          displayName = otherMember.nickname
          displayAvatar = otherMember.avatar
        }
      }

      return {
        ...room,
        name: displayName,
        avatar: displayAvatar,
        unread_count: unreadCount
      }
    }))

    res.json({ code: 200, message: '获取成功', data: { total, items } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

// GET /api/mobile_officing/chat/room/:roomId/messages — 历史消息
router.get('/room/:roomId/messages', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userid
    const { roomId } = req.params
    const { before, pageSize = 20, page = 1 } = req.query
    const size = parseInt(pageSize)

    // 查找房间并校验成员
    const room = await Room.findOne({ room_id: roomId, 'members.user_id': userId }).lean()
    if (!room) {
      return res.json({ code: 404, message: '房间不存在或无权限访问' })
    }

    // 构建查询条件
    const filter = { room: roomId }
    if (before) {
      filter.createdAt = { $lt: new Date(before) }
    }

    const total = await Message.countDocuments({ room: roomId })

    let messages
    if (before) {
      // 游标分页
      messages = await Message.find(filter)
        .sort({ createdAt: -1 })
        .limit(size)
        .lean()
    } else {
      // 页码分页兜底
      messages = await Message.find(filter)
        .sort({ createdAt: -1 })
        .skip((parseInt(page) - 1) * size)
        .limit(size)
        .lean()
    }

    // 反转为时间正序
    messages.reverse()

    // 为当前用户动态计算 is_sender
    const items = messages.map(msg => ({
      ...msg,
      is_sender: msg.sender_id === userId
    }))

    res.json({ code: 200, message: '获取成功', data: { total, items } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

module.exports = router
