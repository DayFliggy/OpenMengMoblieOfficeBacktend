const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const memberSubSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  nickname: { type: String, default: '' },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
  joined_at: { type: Date, default: Date.now },
  last_read_at: { type: Date, default: Date.now }
}, { _id: false })

const roomSchema = new mongoose.Schema({
  room_id: { type: String, default: () => uuidv4(), unique: true },
  type: { type: String, enum: ['private', 'group'], required: true },
  name: { type: String, default: '' },
  avatar: { type: String, default: '' },
  members: { type: [memberSubSchema], default: [] },
  last_message: { type: String, default: '' },
  last_message_time: { type: Date },
  created_by: { type: String, default: '' }
}, { timestamps: true })

roomSchema.index({ 'members.user_id': 1, last_message_time: -1 })
roomSchema.index({ type: 1, 'members.user_id': 1 })

module.exports = mongoose.model('Room', roomSchema)
