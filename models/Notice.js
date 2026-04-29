const mongoose = require('mongoose')

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, default: '' },
  read_count: { type: Number, default: 0 },
  publish_department: { type: String, default: '' },
  content: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('Notice', noticeSchema)
