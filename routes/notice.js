const express = require('express')
const Notice = require('../models/Notice')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/mobile_officing/notice/list
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 }).lean()
    res.json({ code: 200, message: '获取成功', data: notices })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

module.exports = router
