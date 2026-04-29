const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  department_id: { type: String, default: '' },
  department_name: { type: String, default: '' },
  team_name: { type: String, default: '' },
  position: { type: String, default: '' },
  direct_leader: { type: String, default: '' },
  entry_time: { type: String, default: '' },
  remark: { type: String, default: '' },
  status: { type: Number, default: 1 }
}, { timestamps: true })

module.exports = mongoose.model('Employee', employeeSchema)
