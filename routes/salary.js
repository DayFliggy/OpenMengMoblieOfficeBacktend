const express = require('express')
const Salary = require('../models/Salary')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/mobile_officing/salary/list
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query
    const pageNum = parseInt(page)
    const size = parseInt(pageSize)

    const total = await Salary.countDocuments()
    const items = await Salary.find()
      .sort({ year: -1, month: -1 })
      .skip((pageNum - 1) * size)
      .limit(size)
      .lean()

    res.json({ code: 200, message: '获取成功', data: { total, items } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

// GET /api/mobile_officing/salary/info
router.get('/info', authMiddleware, async (req, res) => {
  try {
    const { id } = req.query
    if (!id) {
      return res.json({ code: 400, message: '缺少工资单ID' })
    }

    const salary = await Salary.findById(id).lean()
    if (!salary) {
      return res.json({ code: 404, message: '工资单不存在' })
    }

    res.json({ code: 200, message: '获取成功', data: salary })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

module.exports = router
