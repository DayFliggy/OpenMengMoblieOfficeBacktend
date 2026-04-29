const express = require('express')
const Process = require('../models/Process')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/mobile_officing/process/list
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const { type_id, page = 1, pageSize = 10 } = req.query
    const pageNum = parseInt(page)
    const size = parseInt(pageSize)

    const filter = { status: 1 }
    if (type_id && type_id !== '0') {
      filter.type_id = type_id
    }

    const total = await Process.countDocuments(filter)
    const items = await Process.find(filter)
      .sort({ created_at: -1 })
      .skip((pageNum - 1) * size)
      .limit(size)
      .lean()

    res.json({ code: 200, message: '获取成功', data: { total, items } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

// POST /api/mobile_officing/process/add
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const process = new Process(req.body)
    await process.save()
    res.json({ code: 200, message: '提交成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

module.exports = router
