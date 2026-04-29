const mongoose = require('mongoose')

const processSchema = new mongoose.Schema({
  approve_number: { type: String, default: '' },
  department: { type: String, default: '' },
  type_id: { type: String, default: '1' },
  type: { type: String, default: '' },
  reason: { type: String, default: '' },
  begin_date: { type: String, default: '' },
  end_date: { type: String, default: '' },
  begin_time: { type: String, default: '' },
  end_time: { type: String, default: '' },
  days: { type: String, default: '' },
  hours: { type: String, default: '' },
  initiator: { type: String, default: '' },
  department_leader: { type: String, default: '' },
  personnel_department: { type: String, default: '' },
  cc_persons: { type: [String], default: [] },
  approve_status: { type: Number, default: 1 },
  status: { type: Number, default: 1 }
}, { timestamps: true })

// Auto-generate approve_number before save
processSchema.pre('save', function (next) {
  if (!this.approve_number) {
    this.approve_number = 'APV' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase()
  }
  next()
})

module.exports = mongoose.model('Process', processSchema)
