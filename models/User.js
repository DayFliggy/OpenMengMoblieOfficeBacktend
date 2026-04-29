const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

const userSchema = new mongoose.Schema({
  userid: { type: String, default: () => 'user_' + uuidv4() },
  username: { type: String, default: '' },
  loginname: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tel: { type: String, default: '' },
  telcode: { type: String, default: '86' },
  email: { type: String, default: '' },
  nickname: { type: String, default: '' },
  qq: { type: String, default: '' },
  wx: { type: String, default: '' },
  avatar: { type: String, default: '' },
  sex: { type: Number, default: 0 },
  birthday: { type: String, default: '' },
  createTime: { type: String, default: () => new Date().toISOString() },
  score: { type: Number, default: 0 }
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove sensitive fields from JSON output
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.__v
  delete obj._id
  return obj
}

module.exports = mongoose.model('User', userSchema)
