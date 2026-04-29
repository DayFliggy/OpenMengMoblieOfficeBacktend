const express = require('express')
const multer = require('multer')
const path = require('path')

const router = express.Router()

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/chats'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png'
    cb(null, Date.now() + ext)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
})

// POST /admin/file/chats/upload
router.post('/chats/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.json({ code: 400, message: '请选择文件' })
    }

    const fileUrl = `/uploads/chats/${req.file.filename}`
    res.json({ code: 200, message: '上传成功', data: { url: fileUrl } })
  } catch (err) {
    res.json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

module.exports = router
