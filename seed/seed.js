const mongoose = require('mongoose')
const connectDB = require('../config/db')
const User = require('../models/User')
const Employee = require('../models/Employee')
const Department = require('../models/Department')
const Process = require('../models/Process')
const Salary = require('../models/Salary')
const Notice = require('../models/Notice')
const Message = require('../models/Message')
const Room = require('../models/Room')

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
  await Room.deleteMany({})

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

  // 更多测试用户（用于会话列表测试）
  const user2 = await User.create({
    userid: 'user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b',
    username: '张一山',
    loginname: '13800138001',
    password: '123456',
    tel: '13800138001',
    nickname: '张一山',
    avatar: 'https://img2.baidu.com/it/u=3886332418,2814062330&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    sex: 1,
    score: 80
  })

  const user3 = await User.create({
    userid: 'user_a1b2c3d4-1111-2222-3333-444455556666',
    username: '李华',
    loginname: '13800138002',
    password: '123456',
    tel: '13800138002',
    nickname: '李华',
    avatar: 'https://img2.baidu.com/it/u=2206396288,1703771519&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    sex: 1,
    score: 60
  })

  const user4 = await User.create({
    userid: 'user_e5f6a7b8-5555-6666-7777-888899990000',
    username: '赵雯',
    loginname: '13800138003',
    password: '123456',
    tel: '13800138003',
    nickname: '赵雯',
    avatar: 'https://img2.baidu.com/it/u=3328487706,2212734756&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    sex: 0,
    score: 90
  })

  const user5 = await User.create({
    userid: 'user_c9d0e1f2-9999-aaaa-bbbb-ccccddddeeee',
    username: '王五',
    loginname: '13800138004',
    password: '123456',
    tel: '13800138004',
    nickname: '王五',
    avatar: 'https://img2.baidu.com/it/u=1065765458,3109367369&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400',
    sex: 1,
    score: 70
  })

  console.log('Created additional users')

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
  const avatarZs = 'https://img2.baidu.com/it/u=1477138556,2382360194&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400'
  const avatarZys = 'https://img2.baidu.com/it/u=3886332418,2814062330&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400'

  const msg = (data, time) => Message.create({ ...data, createdAt: time, updatedAt: time })

  // ---- 第一天：2024-03-18 下午 ----
  await msg({
    media_type: 'time', content: '2024-03-18 14:20',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 2, type: 'private', avatar: '', is_sender: false, nickname: '系统'
  }, '2024-03-18T06:20:00.000Z')

  // 张一山发起聊天（左侧消息，is_sender=false）
  await msg({
    media_type: 'text', content: '你好，我是新来的张一山，请多指教！',
    room, sender_id: receiverId, receiver_id: senderId,
    status: 2, type: 'private', avatar: avatarZys, is_sender: false, nickname: '张一山'
  }, '2024-03-18T06:21:00.000Z')

  // 张三回复（右侧消息，is_sender=true）
  await msg({
    media_type: 'text', content: '你好你好，欢迎加入团队！',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 2, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-18T06:22:00.000Z')

  await msg({
    media_type: 'text', content: '谢谢！我刚入职对项目还不太熟悉，能带我了解一下吗？',
    room, sender_id: receiverId, receiver_id: senderId,
    status: 2, type: 'private', avatar: avatarZys, is_sender: false, nickname: '张一山'
  }, '2024-03-18T06:23:00.000Z')

  await msg({
    media_type: 'text', content: '没问题，明天上午我带你过一遍项目架构',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 2, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-18T06:25:00.000Z')

  // ---- 第二天：2024-03-19 上午 ----
  await msg({
    media_type: 'time', content: '2024-03-19 09:30',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 2, type: 'private', avatar: '', is_sender: false, nickname: '系统'
  }, '2024-03-19T01:30:00.000Z')

  await msg({
    media_type: 'text', content: '昨天说的项目架构文档，我整理了一份，你看看',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 2, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-19T01:31:00.000Z')

  // 发送图片消息（测试 media_type: image）
  await msg({
    media_type: 'image', content: 'http://localhost:3002/uploads/chats/architecture.png',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 2, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-19T01:32:00.000Z')

  await msg({
    media_type: 'text', content: '太感谢了！这个架构图很清晰',
    room, sender_id: receiverId, receiver_id: senderId,
    status: 2, type: 'private', avatar: avatarZys, is_sender: false, nickname: '张一山'
  }, '2024-03-19T01:35:00.000Z')

  await msg({
    media_type: 'text', content: '对了，下午有个技术评审会议你参加一下',
    room, sender_id: receiverId, receiver_id: senderId,
    status: 2, type: 'private', avatar: avatarZys, is_sender: false, nickname: '张一山'
  }, '2024-03-19T01:36:00.000Z')

  await msg({
    media_type: 'text', content: '好的，几点开始？在哪里开？',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 2, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-19T01:38:00.000Z')

  await msg({
    media_type: 'text', content: '下午2点，3楼会议室',
    room, sender_id: receiverId, receiver_id: senderId,
    status: 2, type: 'private', avatar: avatarZys, is_sender: false, nickname: '张一山'
  }, '2024-03-19T01:40:00.000Z')

  // ---- 当天下午：2024-03-19 14:00 ----
  await msg({
    media_type: 'time', content: '2024-03-19 14:05',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 2, type: 'private', avatar: '', is_sender: false, nickname: '系统'
  }, '2024-03-19T06:05:00.000Z')

  await msg({
    media_type: 'text', content: '会议开始了，你到了吗？',
    room, sender_id: receiverId, receiver_id: senderId,
    status: 2, type: 'private', avatar: avatarZys, is_sender: false, nickname: '张一山'
  }, '2024-03-19T06:06:00.000Z')

  await msg({
    media_type: 'text', content: '马上到，电梯里了',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 2, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-19T06:07:00.000Z')

  // ---- 第三天：2024-03-20 （最新消息，含未读） ----
  await msg({
    media_type: 'time', content: '2024-03-20 10:15',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 1, type: 'private', avatar: '', is_sender: false, nickname: '系统'
  }, '2024-03-20T02:15:00.000Z')

  await msg({
    media_type: 'text', content: '早啊，昨天会议的纪要我整理好了',
    room, sender_id: receiverId, receiver_id: senderId,
    status: 1, type: 'private', avatar: avatarZys, is_sender: false, nickname: '张一山'
  }, '2024-03-20T02:16:00.000Z')

  // 发送视频消息（测试 media_type: video）
  await msg({
    media_type: 'video', content: 'http://localhost:3002/uploads/chats/meeting_record.mp4',
    room, sender_id: receiverId, receiver_id: senderId,
    status: 1, type: 'private', avatar: avatarZys, is_sender: false, nickname: '张一山'
  }, '2024-03-20T02:18:00.000Z')

  await msg({
    media_type: 'text', content: '收到，我看看',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 1, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-20T02:20:00.000Z')

  await msg({
    media_type: 'text', content: '对了，上次说的项目文档写好了吗？',
    room, sender_id: receiverId, receiver_id: senderId,
    status: 1, type: 'private', avatar: avatarZys, is_sender: false, nickname: '张一山'
  }, '2024-03-20T02:22:00.000Z')

  await msg({
    media_type: 'text', content: '已经写好了，下午发给你看看',
    room, sender_id: senderId, receiver_id: receiverId,
    status: 1, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-20T02:25:00.000Z')

  // ---- 李华的私聊消息 ----
  const room2 = 'a1b2c3d4-1111-2222-3333-444455556666'

  await msg({
    media_type: 'time', content: '2024-03-20 09:00',
    room: room2, sender_id: senderId, receiver_id: user3.userid,
    status: 2, type: 'private', avatar: '', is_sender: false, nickname: '系统'
  }, '2024-03-20T01:00:00.000Z')

  await msg({
    media_type: 'text', content: '三哥，下午的代码评审准备好了吗？',
    room: room2, sender_id: user3.userid, receiver_id: senderId,
    status: 2, type: 'private', avatar: user3.avatar, is_sender: false, nickname: '李华'
  }, '2024-03-20T01:02:00.000Z')

  await msg({
    media_type: 'text', content: '准备好了，我把PPT发你看看',
    room: room2, sender_id: senderId, receiver_id: user3.userid,
    status: 2, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-20T01:05:00.000Z')

  await msg({
    media_type: 'image', content: 'http://localhost:3002/uploads/chats/review_ppt.png',
    room: room2, sender_id: senderId, receiver_id: user3.userid,
    status: 2, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-20T01:06:00.000Z')

  await msg({
    media_type: 'text', content: '收到，我看一下',
    room: room2, sender_id: user3.userid, receiver_id: senderId,
    status: 1, type: 'private', avatar: user3.avatar, is_sender: false, nickname: '李华'
  }, '2024-03-20T03:30:00.000Z')

  await msg({
    media_type: 'text', content: '内容很详细，没什么问题',
    room: room2, sender_id: user3.userid, receiver_id: senderId,
    status: 1, type: 'private', avatar: user3.avatar, is_sender: false, nickname: '李华'
  }, '2024-03-20T03:35:00.000Z')

  await msg({
    media_type: 'text', content: '好的，那下午见',
    room: room2, sender_id: senderId, receiver_id: user3.userid,
    status: 1, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-20T03:40:00.000Z')

  // ---- 赵雯的私聊消息（无未读） ----
  const room3 = 'e5f6a7b8-5555-6666-7777-888899990000'

  await msg({
    media_type: 'time', content: '2024-03-15 16:00',
    room: room3, sender_id: senderId, receiver_id: user4.userid,
    status: 2, type: 'private', avatar: '', is_sender: false, nickname: '系统'
  }, '2024-03-15T08:00:00.000Z')

  await msg({
    media_type: 'text', content: '赵雯，人事部的月报发我一份',
    room: room3, sender_id: senderId, receiver_id: user4.userid,
    status: 2, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-15T08:05:00.000Z')

  await msg({
    media_type: 'text', content: '好的，马上发',
    room: room3, sender_id: user4.userid, receiver_id: senderId,
    status: 2, type: 'private', avatar: user4.avatar, is_sender: false, nickname: '赵雯'
  }, '2024-03-15T08:06:00.000Z')

  await msg({
    media_type: 'text', content: 'http://localhost:3002/uploads/chats/monthly_report.pdf',
    room: room3, sender_id: user4.userid, receiver_id: senderId,
    status: 2, type: 'private', avatar: user4.avatar, is_sender: false, nickname: '赵雯'
  }, '2024-03-15T08:10:00.000Z')

  await msg({
    media_type: 'text', content: '收到了，谢谢',
    room: room3, sender_id: senderId, receiver_id: user4.userid,
    status: 2, type: 'private', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-15T08:12:00.000Z')

  // ---- 王五的群聊消息 ----
  const room4 = 'c9d0e1f2-9999-aaaa-bbbb-ccccddddeeee'
  const groupMembers = [
    { user_id: senderId, nickname: '张三', avatar: avatarZs, is_sender: false },
    { user_id: user2.userid, nickname: '张一山', avatar: user2.avatar, is_sender: false },
    { user_id: user3.userid, nickname: '李华', avatar: user3.avatar, is_sender: false },
    { user_id: user5.userid, nickname: '王五', avatar: user5.avatar, is_sender: false }
  ]

  await msg({
    media_type: 'time', content: '2024-03-20 08:30',
    room: room4, sender_id: senderId, receiver_id: '',
    status: 2, type: 'group', avatar: '', is_sender: false, nickname: '系统'
  }, '2024-03-20T00:30:00.000Z')

  await msg({
    media_type: 'text', content: '各位早上好，今天的站会照常进行',
    room: room4, sender_id: user5.userid, receiver_id: '',
    status: 2, type: 'group', avatar: user5.avatar, is_sender: false, nickname: '王五'
  }, '2024-03-20T00:32:00.000Z')

  await msg({
    media_type: 'text', content: '收到',
    room: room4, sender_id: senderId, receiver_id: '',
    status: 2, type: 'group', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-20T00:33:00.000Z')

  await msg({
    media_type: 'text', content: '收到',
    room: room4, sender_id: user2.userid, receiver_id: '',
    status: 2, type: 'group', avatar: user2.avatar, is_sender: false, nickname: '张一山'
  }, '2024-03-20T00:34:00.000Z')

  await msg({
    media_type: 'text', content: '今天主要讨论一下新版本的发布计划',
    room: room4, sender_id: user5.userid, receiver_id: '',
    status: 1, type: 'group', avatar: user5.avatar, is_sender: false, nickname: '王五'
  }, '2024-03-20T04:00:00.000Z')

  await msg({
    media_type: 'text', content: '我这边功能已经开发完了，可以提测',
    room: room4, sender_id: user3.userid, receiver_id: '',
    status: 1, type: 'group', avatar: user3.avatar, is_sender: false, nickname: '李华'
  }, '2024-03-20T04:05:00.000Z')

  await msg({
    media_type: 'text', content: '我的也差不多了，下午提交',
    room: room4, sender_id: senderId, receiver_id: '',
    status: 1, type: 'group', avatar: avatarZs, is_sender: true, nickname: '张三'
  }, '2024-03-20T04:10:00.000Z')

  console.log('Created chat messages')

  // ========== Rooms ==========
  const roomId = '30908286-466b-485e-b673-332db053bd18'

  // 张三与张一山的私聊
  await Room.create({
    room_id: roomId,
    type: 'private',
    members: [
      {
        user_id: senderId,
        nickname: '张三',
        avatar: avatarZs,
        role: 'owner',
        joined_at: new Date('2024-03-18T06:20:00.000Z'),
        last_read_at: new Date('2024-03-19T06:10:00.000Z')
      },
      {
        user_id: receiverId,
        nickname: '张一山',
        avatar: user2.avatar,
        role: 'member',
        joined_at: new Date('2024-03-18T06:20:00.000Z'),
        last_read_at: new Date('2024-03-20T02:25:00.000Z')
      }
    ],
    last_message: '已经写好了，下午发给你看看',
    last_message_time: new Date('2024-03-20T02:25:00.000Z'),
    created_by: senderId
  })

  // 张三与李华的私聊
  await Room.create({
    room_id: room2,
    type: 'private',
    members: [
      {
        user_id: senderId,
        nickname: '张三',
        avatar: avatarZs,
        role: 'owner',
        joined_at: new Date('2024-03-20T01:00:00.000Z'),
        last_read_at: new Date('2024-03-20T01:10:00.000Z')
      },
      {
        user_id: user3.userid,
        nickname: '李华',
        avatar: user3.avatar,
        role: 'member',
        joined_at: new Date('2024-03-20T01:00:00.000Z'),
        last_read_at: new Date('2024-03-20T03:40:00.000Z')
      }
    ],
    last_message: '好的，那下午见',
    last_message_time: new Date('2024-03-20T03:40:00.000Z'),
    created_by: senderId
  })

  // 张三与赵雯的私聊（无未读）
  await Room.create({
    room_id: room3,
    type: 'private',
    members: [
      {
        user_id: senderId,
        nickname: '张三',
        avatar: avatarZs,
        role: 'owner',
        joined_at: new Date('2024-03-15T08:00:00.000Z'),
        last_read_at: new Date('2024-03-15T08:15:00.000Z')
      },
      {
        user_id: user4.userid,
        nickname: '赵雯',
        avatar: user4.avatar,
        role: 'member',
        joined_at: new Date('2024-03-15T08:00:00.000Z'),
        last_read_at: new Date('2024-03-15T08:15:00.000Z')
      }
    ],
    last_message: '收到了，谢谢',
    last_message_time: new Date('2024-03-15T08:12:00.000Z'),
    created_by: senderId
  })

  // 技术部群聊
  await Room.create({
    room_id: room4,
    type: 'group',
    name: '技术部交流群',
    avatar: '',
    members: [
      {
        user_id: senderId,
        nickname: '张三',
        avatar: avatarZs,
        role: 'owner',
        joined_at: new Date('2024-03-20T00:30:00.000Z'),
        last_read_at: new Date('2024-03-20T00:35:00.000Z')
      },
      {
        user_id: user2.userid,
        nickname: '张一山',
        avatar: user2.avatar,
        role: 'member',
        joined_at: new Date('2024-03-20T00:30:00.000Z'),
        last_read_at: new Date('2024-03-20T04:10:00.000Z')
      },
      {
        user_id: user3.userid,
        nickname: '李华',
        avatar: user3.avatar,
        role: 'member',
        joined_at: new Date('2024-03-20T00:30:00.000Z'),
        last_read_at: new Date('2024-03-20T04:10:00.000Z')
      },
      {
        user_id: user5.userid,
        nickname: '王五',
        avatar: user5.avatar,
        role: 'admin',
        joined_at: new Date('2024-03-20T00:30:00.000Z'),
        last_read_at: new Date('2024-03-20T04:10:00.000Z')
      }
    ],
    last_message: '我的也差不多了，下午提交',
    last_message_time: new Date('2024-03-20T04:10:00.000Z'),
    created_by: senderId
  })

  console.log('Created rooms')

  console.log('\n========== Seed completed ==========')
  console.log('Test account: loginname=17704051019, password=123456')
  console.log('====================================\n')

  process.exit(0)
}

seedData().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
