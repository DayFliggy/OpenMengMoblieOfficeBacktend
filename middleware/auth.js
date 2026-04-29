const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'mobile_office_secret_key_2024'

const authMiddleware = async (req, res, next) => {
  const token = req.headers['token']
  if (!token) {
    return res.json({ code: 401, message: '未登录，请先登录' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findOne({ userid: decoded.userid })
    if (!user) {
      return res.json({ code: 401, message: '用户不存在' })
    }
    req.user = user
    next()
  } catch (err) {
    return res.json({ code: 401, message: 'token无效或已过期' })
  }
}

module.exports = { authMiddleware, JWT_SECRET }
