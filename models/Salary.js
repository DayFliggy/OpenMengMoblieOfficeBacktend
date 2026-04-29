const mongoose = require('mongoose')

const salarySchema = new mongoose.Schema({
  employee_id: { type: String, default: '' },
  year: { type: String, default: '' },
  month: { type: String, default: '' },
  base_salary: { type: String, default: '0' },
  merit_salary: { type: String, default: '0' },
  absence_days: { type: String, default: '0' },
  sick_leave_days: { type: String, default: '0' },
  welfare_bonus: { type: String, default: '0' },
  social_security_total: { type: String, default: '0' },
  provident_fund_total: { type: String, default: '0' },
  net_salary: { type: String, default: '0' },
  status: { type: Number, default: 1 },
  job_number: { type: String, default: '' },
  department: { type: String, default: '' }
}, { timestamps: true })

module.exports = mongoose.model('Salary', salarySchema)
