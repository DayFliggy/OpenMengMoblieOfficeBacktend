const express = require('express')
const Employee = require('../models/Employee')
const Department = require('../models/Department')
const { authMiddleware } = require('../middleware/auth')

const router = express.Router()

// GET /api/mobile_officing/employee/list
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find({ status: 1 }).sort({ created_at: -1 })
    res.json({ code: 200, message: '获取成功', data: employees })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

// GET /api/mobile_officing/employee/department/list
router.get('/department/list', authMiddleware, async (req, res) => {
  try {
    const departments = await Department.find().lean()
    // Populate employees for each department
    const result = await Promise.all(
      departments.map(async (dept) => {
        const employees = await Employee.find({
          department_id: dept._id.toString(),
          status: 1
        }).lean()
        return { ...dept, employees }
      })
    )
    res.json({ code: 200, message: '获取成功', data: result })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

module.exports = router
