const mongoose = require('mongoose')
const connectDB = require('../config/db')
const User = require('../models/User')
const Employee = require('../models/Employee')
const Department = require('../models/Department')
const Process = require('../models/Process')
const Salary = require('../models/Salary')
const Notice = require('../models/Notice')
const Message = require('../models/Message')

const seedData = async () => {
  await connectDB()

  // Clear existing data
  await User.deleteMany({})
  await Employee.deleteMany({})
  await Department.deleteMany({})
  await Process.deleteMany({})
  await Salary.deleteMany({})
  await Notice.deleteMany({})
  await Message.deleteMany({})

  console.log('Cleared existing data')

  // ========== Users ==========
  const user = await User.create({
    userid: 'user_b7d8955c-8339-458e-a13b-461b1271e5d4',
    username: '张三',
    loginname: '17704051019',
    password: '123456',
    tel: '17704051019',
    telcode: '86',
    email: 'zhangsan@example.com',
    nickname: '张三',
    qq: '123456789',
    wx: 'zhangsan_wx',
    avatar: 'https://img2.baidu.com/it/u=1477138556,2382360194&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    sex: 1,
    birthday: '1995-06-15',
    score: 100
  })
  console.log('Created user: 张三')

  // ========== Departments ==========
  const dept1 = await Department.create({ name: '技术部', team: '研发一组' })
  const dept2 = await Department.create({ name: '人事部', team: '人事一组' })
  const dept3 = await Department.create({ name: '行政部', team: '行政一组' })
  console.log('Created departments')

  // ========== Employees ==========
  const emp1 = await Employee.create({
    name: '张三',
    avatar: 'https://img2.baidu.com/it/u=1477138556,2382360194&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    phone: '17704051019',
    department_id: dept1._id.toString(),
    department_name: '技术部',
    team_name: '研发一组',
    position: '前端工程师',
    direct_leader: '李四',
    entry_time: '2023-03-15',
    remark: '表现优秀',
    status: 1
  })

  await Employee.create({
    name: '李四',
    avatar: '',
    phone: '13800138001',
    department_id: dept1._id.toString(),
    department_name: '技术部',
    team_name: '研发一组',
    position: '技术总监',
    direct_leader: '王总',
    entry_time: '2020-01-10',
    remark: '',
    status: 1
  })

  await Employee.create({
    name: '王五',
    avatar: '',
    phone: '13800138002',
    department_id: dept1._id.toString(),
    department_name: '技术部',
    team_name: '研发二组',
    position: '后端工程师',
    direct_leader: '李四',
    entry_time: '2022-06-20',
    remark: '',
    status: 1
  })

  await Employee.create({
    name: '赵六',
    avatar: '',
    phone: '13800138003',
    department_id: dept2._id.toString(),
    department_name: '人事部',
    team_name: '人事一组',
    position: '人事专员',
    direct_leader: '钱七',
    entry_time: '2021-09-01',
    remark: '',
    status: 1
  })

  await Employee.create({
    name: '钱七',
    avatar: '',
    phone: '13800138004',
    department_id: dept2._id.toString(),
    department_name: '人事部',
    team_name: '人事一组',
    position: '人事经理',
    direct_leader: '王总',
    entry_time: '2019-03-01',
    remark: '',
    status: 1
  })

  await Employee.create({
    name: '孙八',
    avatar: '',
    phone: '13800138005',
    department_id: dept3._id.toString(),
    department_name: '行政部',
    team_name: '行政一组',
    position: '行政专员',
    direct_leader: '周九',
    entry_time: '2022-11-15',
    remark: '',
    status: 1
  })

  await Employee.create({
    name: '周九',
    avatar: '',
    phone: '13800138006',
    department_id: dept3._id.toString(),
    department_name: '行政部',
    team_name: '行政一组',
    position: '行政经理',
    direct_leader: '王总',
    entry_time: '2018-05-20',
    remark: '',
    status: 1
  })

  // Update department employees
  await Department.findByIdAndUpdate(dept1._id, { employees: [emp1._id] })

  console.log('Created employees')

  // ========== Processes ==========
  await Process.create({
    approve_number: 'APV202401001',
    department: '技术部',
    type_id: '1',
    type: '请假申请',
    reason: '家中有事需要处理',
    begin_date: '2024-01-20',
    end_date: '2024-01-22',
    begin_time: '09:00',
    end_time: '18:00',
    days: '2',
    hours: '16',
    initiator: '张三',
    department_leader: '李四',
    personnel_department: '钱七',
    cc_persons: ['王五'],
    approve_status: 3,
    status: 1
  })

  await Process.create({
    approve_number: 'APV202402001',
    department: '技术部',
    type_id: '1',
    type: '请假申请',
    reason: '身体不适，需要休息',
    begin_date: '2024-02-05',
    end_date: '2024-02-05',
    begin_time: '09:00',
    end_time: '18:00',
    days: '1',
    hours: '8',
    initiator: '张三',
    department_leader: '李四',
    personnel_department: '钱七',
    cc_persons: [],
    approve_status: 2,
    status: 1
  })

  await Process.create({
    approve_number: 'APV202403001',
    department: '技术部',
    type_id: '2',
    type: '行政事务',
    reason: '需要购买开发用显示器',
    begin_date: '2024-03-10',
    end_date: '2024-03-10',
    begin_time: '14:00',
    end_time: '17:00',
    days: '0',
    hours: '3',
    initiator: '张三',
    department_leader: '李四',
    personnel_department: '',
    cc_persons: ['孙八'],
    approve_status: 1,
    status: 1
  })

  await Process.create({
    approve_number: 'APV202403002',
    department: '技术部',
    type_id: '1',
    type: '请假申请',
    reason: '参加朋友婚礼',
    begin_date: '2024-03-25',
    end_date: '2024-03-25',
    begin_time: '09:00',
    end_time: '18:00',
    days: '1',
    hours: '8',
    initiator: '张三',
    department_leader: '李四',
    personnel_department: '钱七',
    cc_persons: [],
    approve_status: 4,
    status: 1
  })

  await Process.create({
    approve_number: 'APV202404001',
    department: '技术部',
    type_id: '4',
    type: '业务相关',
    reason: '项目上线需要加班配合',
    begin_date: '2024-04-15',
    end_date: '2024-04-16',
    begin_time: '18:00',
    end_time: '22:00',
    days: '0',
    hours: '8',
    initiator: '张三',
    department_leader: '李四',
    personnel_department: '',
    cc_persons: ['王五', '赵六'],
    approve_status: 3,
    status: 1
  })

  console.log('Created processes')

  // ========== Salaries ==========
  await Salary.create({
    employee_id: emp1._id.toString(),
    year: '2024',
    month: '01',
    base_salary: '15000',
    merit_salary: '3000',
    absence_days: '0',
    sick_leave_days: '0',
    welfare_bonus: '2000',
    social_security_total: '1650',
    provident_fund_total: '1800',
    net_salary: '16550',
    status: 1,
    job_number: 'EMP001',
    department: '技术部'
  })

  await Salary.create({
    employee_id: emp1._id.toString(),
    year: '2024',
    month: '02',
    base_salary: '15000',
    merit_salary: '2800',
    absence_days: '1',
    sick_leave_days: '1',
    welfare_bonus: '0',
    social_security_total: '1650',
    provident_fund_total: '1800',
    net_salary: '13983',
    status: 1,
    job_number: 'EMP001',
    department: '技术部'
  })

  await Salary.create({
    employee_id: emp1._id.toString(),
    year: '2024',
    month: '03',
    base_salary: '15000',
    merit_salary: '3500',
    absence_days: '0',
    sick_leave_days: '0',
    welfare_bonus: '2000',
    social_security_total: '1650',
    provident_fund_total: '1800',
    net_salary: '17050',
    status: 1,
    job_number: 'EMP001',
    department: '技术部'
  })

  console.log('Created salaries')

  // ========== Notices ==========
  await Notice.create({
    title: '关于2024年春节放假安排的通知',
    date: '2024-01-15',
    read_count: 156,
    publish_department: '行政部',
    content: 'notice_html/notice1.html'
  })

  await Notice.create({
    title: '关于开展年度员工体检的通知',
    date: '2024-02-01',
    read_count: 89,
    publish_department: '人事部',
    content: 'notice_html/notice2.html'
  })

  await Notice.create({
    title: '关于公司搬迁新办公地址的通知',
    date: '2024-03-15',
    read_count: 203,
    publish_department: '行政部',
    content: 'notice_html/notice3.html'
  })

  console.log('Created notices')

  // ========== Chat Messages ==========
  const room = '30908286-466b-485e-b673-332db053bd18'
  const senderId = 'user_b7d8955c-8339-458e-a13b-461b1271e5d4'
  const receiverId = 'user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b'

  await Message.create({
    media_type: 'time',
    content: '2024-03-20 14:30',
    room,
    sender_id: senderId,
    receiver_id: receiverId,
    status: 2,
    type: 'private',
    avatar: '',
    is_sender: false,
    nickname: '系统'
  })

  await Message.create({
    media_type: 'text',
    content: '你好，在吗？',
    room,
    sender_id: receiverId,
    receiver_id: senderId,
    status: 2,
    type: 'private',
    avatar: 'https://img2.baidu.com/it/u=1477138556,2382360194&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    is_sender: false,
    nickname: '张一山'
  })

  await Message.create({
    media_type: 'text',
    content: '在的，有什么事吗？',
    room,
    sender_id: senderId,
    receiver_id: receiverId,
    status: 2,
    type: 'private',
    avatar: 'https://img2.baidu.com/it/u=1477138556,2382360194&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    is_sender: true,
    nickname: '张三'
  })

  await Message.create({
    media_type: 'text',
    content: '明天下午的技术评审会议记得参加',
    room,
    sender_id: receiverId,
    receiver_id: senderId,
    status: 2,
    type: 'private',
    avatar: 'https://img2.baidu.com/it/u=1477138556,2382360194&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    is_sender: false,
    nickname: '张一山'
  })

  await Message.create({
    media_type: 'text',
    content: '好的，我会准时参加的',
    room,
    sender_id: senderId,
    receiver_id: receiverId,
    status: 2,
    type: 'private',
    avatar: 'https://img2.baidu.com/it/u=1477138556,2382360194&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    is_sender: true,
    nickname: '张三'
  })

  await Message.create({
    media_type: 'text',
    content: '对了，上次说的项目文档写好了吗？',
    room,
    sender_id: receiverId,
    receiver_id: senderId,
    status: 1,
    type: 'private',
    avatar: 'https://img2.baidu.com/it/u=1477138556,2382360194&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    is_sender: false,
    nickname: '张一山'
  })

  await Message.create({
    media_type: 'text',
    content: '已经写好了，下午发给你看看',
    room,
    sender_id: senderId,
    receiver_id: receiverId,
    status: 1,
    type: 'private',
    avatar: 'https://img2.baidu.com/it/u=1477138556,2382360194&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    is_sender: true,
    nickname: '张三'
  })

  console.log('Created chat messages')

  console.log('\n========== Seed completed ==========')
  console.log('Test account: loginname=17704051019, password=123456')
  console.log('====================================\n')

  process.exit(0)
}

seedData().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
