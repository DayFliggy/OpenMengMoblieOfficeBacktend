const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { authMiddleware, JWT_SECRET } = require('../middleware/auth')

const router = express.Router()

// 验证码临时存储 { phone: { code, expireAt } }
const smsCodeStore = new Map()

// POST /api/mobile_officing/user/login
router.post('/login', async (req, res) => {
  try {
    const { loginname, password } = req.body
    if (!loginname || !password) {
      return res.json({ code: 400, message: '用户名和密码不能为空' })
    }

    const user = await User.findOne({ loginname })
    if (!user) {
      return res.json({ code: 400, message: '用户不存在' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.json({ code: 400, message: '密码错误' })
    }

    const token = jwt.sign({ userid: user.userid }, JWT_SECRET, { expiresIn: '7d' })

    res.json({ code: 200, message: '登录成功', data: { token } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

// GET /api/mobile_officing/user/info
router.get('/info', authMiddleware, async (req, res) => {
  try {
    res.json({ code: 200, message: '获取成功', data: req.user.toSafeObject() })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

// GET /api/mobile_officing/user/smscode
router.get('/smscode', async (req, res) => {
  try {
    const { phone } = req.query
    if (!phone) {
      return res.json({ code: 400, message: '手机号不能为空' })
    }

    // Simulate SMS code generation
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // 存储验证码，5分钟有效
    smsCodeStore.set(phone, {
      code,
      expireAt: Date.now() + 5 * 60 * 1000
    })

    res.json({ code: 200, message: '验证码发送成功', data: { code } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

// POST /api/mobile_officing/user/changePhone
router.post('/changePhone', authMiddleware, async (req, res) => {
  try {
    const { phone, code } = req.body
    if (!phone || !code) {
      return res.json({ code: 400, message: '手机号和验证码不能为空' })
    }

    // 验证码校验
    const stored = smsCodeStore.get(phone)
    if (!stored) {
      return res.json({ code: 400, message: '请先获取验证码' })
    }
    if (Date.now() > stored.expireAt) {
      smsCodeStore.delete(phone)
      return res.json({ code: 400, message: '验证码已过期，请重新获取' })
    }
    if (stored.code !== code) {
      return res.json({ code: 400, message: '验证码错误' })
    }

    // 验证通过，删除已用验证码
    smsCodeStore.delete(phone)

    req.user.tel = phone
    req.user.loginname = phone
    await req.user.save()

    res.json({ code: 200, message: '手机号修改成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

// POST /api/mobile_officing/user/changePassword
router.post('/changePassword', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
      return res.json({ code: 400, message: '原密码和新密码不能为空' })
    }

    const isMatch = await req.user.comparePassword(oldPassword)
    if (!isMatch) {
      return res.json({ code: 400, message: '原密码错误' })
    }

    req.user.password = newPassword
    await req.user.save()

    res.json({ code: 200, message: '密码修改成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

// POST /api/mobile_officing/user/resetPassword
router.post('/resetPassword', async (req, res) => {
  try {
    const { phone, code, newPassword } = req.body
    if (!phone || !code || !newPassword) {
      return res.json({ code: 400, message: '手机号、验证码和新密码不能为空' })
    }

    const stored = smsCodeStore.get(phone)
    if (!stored) {
      return res.json({ code: 400, message: '验证码错误或已过期' })
    }
    if (Date.now() > stored.expireAt) {
      smsCodeStore.delete(phone)
      return res.json({ code: 400, message: '验证码错误或已过期' })
    }
    if (stored.code !== code) {
      return res.json({ code: 400, message: '验证码错误或已过期' })
    }

    smsCodeStore.delete(phone)

    const user = await User.findOne({ loginname: phone })
    if (!user) {
      return res.json({ code: 400, message: '该手机号未注册' })
    }

    user.password = newPassword
    await user.save()

    res.json({ code: 200, message: '密码重置成功' })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

module.exports = router
