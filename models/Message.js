const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  media_type: { type: String, enum: ['time', 'text', 'image', 'video'], default: 'text' },
  content: { type: String, default: '' },
  is_sender: { type: Boolean, default: false },
  nickname: { type: String, default: '' },
  receiver_id: { type: String, default: '' },
  room: { type: String, required: true },
  sender_id: { type: String, required: true },
  status: { type: Number, default: 1 },
  type: { type: String, default: 'private' },
  avatar: { type: String, default: '' }
}, { timestamps: true })

messageSchema.index({ room: 1, createdAt: -1 })

module.exports = mongoose.model('Message', messageSchema)
