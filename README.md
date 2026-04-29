# OpenMengMoblieOfficeBackend

移动办公 App 后端服务，基于 Node.js + Express + MongoDB 构建，为鸿蒙（HarmonyOS）移动端提供 RESTful API 和 WebSocket 实时聊天服务。

## 技术栈

| 技术 | 用途 |
|------|------|
| Express 4.x | Web 框架 |
| MongoDB + Mongoose | 数据库与 ODM |
| JSON Web Token | 用户认证 |
| bcryptjs | 密码加密 |
| Multer | 文件上传 |
| ws | WebSocket 实时通讯 |
| cors | 跨域支持 |

## 项目结构

```
server/
├── app.js                    # 应用入口
├── config/
│   └── db.js                 # MongoDB 连接配置
├── middleware/
│   └── auth.js               # JWT 认证中间件
├── models/                   # Mongoose 数据模型
│   ├── User.js               # 用户
│   ├── Employee.js           # 员工
│   ├── Department.js         # 部门
│   ├── Process.js            # 审批流程
│   ├── Salary.js             # 工资单
│   ├── Notice.js             # 公告
│   └── Message.js            # 聊天消息
├── routes/                   # API 路由
│   ├── user.js               # 用户接口（登录/信息/验证码/改密/换绑手机）
│   ├── employee.js           # 通讯录接口（员工/部门）
│   ├── process.js            # 审批接口（列表/新增）
│   ├── salary.js             # 工资接口（列表/详情）
│   ├── notice.js             # 公告接口
│   └── file.js               # 文件上传接口
├── websocket/
│   └── chat.js               # WebSocket 聊天服务
├── seed/
│   └── seed.js               # 数据库种子脚本
├── notice_html/              # 公告 HTML 内容页
├── uploads/chats/            # 上传文件存储目录
├── API_DOC.md                # 中文接口文档
├── postman_collection.json   # Postman 测试集合
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- MongoDB >= 5.0

### 安装

```bash
# 克隆仓库
git clone https://github.com/DayFliggy/OpenMengMoblieOfficeBacktend.git
cd OpenMengMoblieOfficeBacktend

# 安装依赖
npm install
```

### 初始化测试数据

```bash
npm run seed
```

预置数据包括：
- 测试用户：`17704051019` / `123456`
- 3 个部门，7 名员工
- 5 条审批记录
- 3 个月工资单
- 3 条公司公告
- 7 条聊天记录

### 启动服务

```bash
# 生产模式
npm start

# 开发模式（需全局安装 nodemon）
npm run dev
```

服务启动后：
- HTTP API: `http://localhost:3002/api/mobile_officing/`
- WebSocket: `ws://localhost:3002/api/chat/connect`

## API 接口总览

| 模块 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 用户 | POST | `/api/mobile_officing/user/login` | 登录 |
| 用户 | GET | `/api/mobile_officing/user/info` | 获取用户信息 |
| 用户 | GET | `/api/mobile_officing/user/smscode` | 获取短信验证码 |
| 用户 | POST | `/api/mobile_officing/user/changePhone` | 更换手机号 |
| 用户 | POST | `/api/mobile_officing/user/changePassword` | 修改密码 |
| 通讯录 | GET | `/api/mobile_officing/employee/list` | 员工列表 |
| 通讯录 | GET | `/api/mobile_officing/employee/department/list` | 部门列表 |
| 审批 | GET | `/api/mobile_officing/process/list` | 审批列表（分页） |
| 审批 | POST | `/api/mobile_officing/process/add` | 新增审批 |
| 工资 | GET | `/api/mobile_officing/salary/list` | 工资列表（分页） |
| 工资 | GET | `/api/mobile_officing/salary/info` | 工资详情 |
| 公告 | GET | `/api/mobile_officing/notice/list` | 公告列表 |
| 文件 | POST | `/admin/file/chats/upload` | 上传聊天文件 |
| 聊天 | WebSocket | `/api/chat/connect` | 实时聊天连接 |

完整接口文档见 [API_DOC.md](./API_DOC.md)

## 认证方式

除登录接口外，所有接口需在请求头携带 `token`：

```
token: <登录时获取的 JWT Token>
```

## 统一响应格式

```json
{
  "code": 200,
  "message": "操作描述",
  "data": {}
}
```

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未登录或 token 无效 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

## 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `PORT` | 3002 | HTTP 服务端口 |
| `MONGODB_URI` | mongodb://127.0.0.1:27017/mobile_office | MongoDB 连接地址 |
| `JWT_SECRET` | mobile_office_secret_key_2024 | JWT 签名密钥 |

## 测试

导入 `postman_collection.json` 到 Postman，集合包含全部接口的请求示例和自动 token 管理。

## 免责声明

本项目仅供学习交流和研究使用，不得用于任何商业用途或非法目的。

- 本项目所涉及的接口、数据模型、业务逻辑均为学习演示之用，不代表任何真实商业系统的实现
- 使用本项目所产生的一切后果由使用者自行承担，项目作者不承担任何责任
- 本项目中涉及的测试数据均为虚构，如有雷同纯属巧合
- 如本项目内容侵犯了您的权益，请联系作者，我们将及时处理

## License

[MIT](./LICENSE)
