# 移动办公后台接口文档

## 一、概述

本文档描述移动办公App后端提供的所有API接口，包括RESTful HTTP接口和WebSocket实时通讯接口。

---

## 二、基础信息

### 2.1 基础URL

```
HTTP接口: http://localhost:3002/api/mobile_officing/
WebSocket: ws://localhost:3001/api/chat/connect
文件上传: http://localhost:3002/admin/file/
静态资源: http://localhost:3002/uploads/
公告内容: http://localhost:3002/notice_html/
```

### 2.2 认证方式

除登录接口外，所有接口需要在请求头中携带 `token` 字段进行身份验证。

```
token: <登录时获取的JWT Token>
```

### 2.3 统一响应格式

所有接口返回JSON格式数据，结构如下：

```json
{
  "code": 200,
  "message": "操作描述",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | number | 状态码，200表示成功，其他表示失败 |
| message | string | 操作结果描述信息 |
| data | object/array | 返回数据（部分接口可能没有此字段） |

### 2.4 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或token无效 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 三、数据模型

### 3.1 用户 (User)

| 字段 | 类型 | 说明 |
|------|------|------|
| userid | string | 用户唯一标识（UUID格式） |
| username | string | 用户名 |
| loginname | string | 登录账号（手机号） |
| tel | string | 手机号码 |
| telcode | string | 国际电话区号，默认86 |
| email | string | 邮箱地址 |
| nickname | string | 昵称 |
| qq | string | QQ号 |
| wx | string | 微信号 |
| avatar | string | 头像URL |
| sex | number | 性别，0=女，1=男 |
| birthday | string | 生日，格式YYYY-MM-DD |
| createTime | string | 注册时间 |
| score | number | 积分 |

### 3.2 员工 (Employee)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 员工ID（MongoDB ObjectId） |
| name | string | 员工姓名 |
| avatar | string | 头像URL |
| phone | string | 手机号 |
| department_id | string | 所属部门ID |
| department_name | string | 所属部门名称 |
| team_name | string | 所属团队名称 |
| position | string | 职位 |
| direct_leader | string | 直属领导 |
| entry_time | string | 入职时间 |
| remark | string | 备注 |
| status | number | 状态，1=在职，0=离职 |
| created_at | string | 创建时间 |
| updated_at | string | 更新时间 |

### 3.3 部门 (Department)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 部门ID |
| name | string | 部门名称 |
| team | string | 团队名称 |
| employees | array | 部门员工列表（Employee数组） |

### 3.4 审批流程 (Process)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 记录ID |
| approve_number | string | 审批编号（自动生成） |
| department | string | 部门名称 |
| type_id | string | 类型ID：1=人事管理，2=行政事务，3=财务类，4=业务相关 |
| type | string | 申请类型（如：请假申请、行政事务等） |
| reason | string | 申请原因/事由 |
| begin_date | string | 开始日期 |
| end_date | string | 结束日期 |
| begin_time | string | 开始时间 |
| end_time | string | 结束时间 |
| days | string | 天数 |
| hours | string | 小时数 |
| initiator | string | 发起人 |
| department_leader | string | 部门领导 |
| personnel_department | string | 人事部门审批人 |
| cc_persons | array | 抄送人列表 |
| approve_status | number | 审批状态：1=待审批，2=审批中，3=已通过，4=已拒绝 |
| status | number | 记录状态，1=正常，0=已删除 |
| created_at | string | 创建时间 |
| updated_at | string | 更新时间 |

### 3.5 工资单 (Salary)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 记录ID |
| employee_id | string | 员工ID |
| year | string | 年份 |
| month | string | 月份 |
| base_salary | string | 基本工资 |
| merit_salary | string | 绩效工资 |
| absence_days | string | 缺勤天数 |
| sick_leave_days | string | 病假天数 |
| welfare_bonus | string | 福利奖金 |
| social_security_total | string | 社保合计 |
| provident_fund_total | string | 公积金合计 |
| net_salary | string | 实发工资 |
| status | number | 状态，1=已发放 |
| job_number | string | 工号 |
| department | string | 部门名称 |
| created_at | string | 创建时间 |
| updated_at | string | 更新时间 |

### 3.6 公告 (Notice)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 记录ID |
| title | string | 公告标题 |
| date | string | 发布日期 |
| read_count | number | 阅读次数 |
| publish_department | string | 发布部门 |
| content | string | 内容文件路径（拼接基础URL后可访问HTML页面） |

### 3.7 聊天消息 (Message)

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 消息ID |
| media_type | string | 消息类型：time=时间分割线，text=文本，image=图片，video=视频 |
| content | string | 消息内容（文本内容或媒体文件URL） |
| is_sender | boolean | 是否为当前用户发送 |
| nickname | string | 发送者昵称 |
| receiver_id | string | 接收者ID |
| room | string | 聊天房间ID |
| sender_id | string | 发送者ID |
| status | number | 消息状态：1=未读，2=已读 |
| type | string | 聊天类型：private=私聊，group=群聊 |
| avatar | string | 发送者头像URL |
| created_at | string | 创建时间 |

---

## 四、接口详细说明

### 4.1 用户模块

#### 4.1.1 用户登录

- **请求方法**: POST
- **请求URL**: `/api/mobile_officing/user/login`
- **是否需要认证**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| loginname | string | 是 | 登录账号（手机号） |
| password | string | 是 | 密码（6-16位数字） |

**请求示例**:

```json
{
  "loginname": "17704051019",
  "password": "123456"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**错误响应**:

```json
{
  "code": 400,
  "message": "用户名和密码不能为空"
}
```

---

#### 4.1.2 获取用户信息

- **请求方法**: GET
- **请求URL**: `/api/mobile_officing/user/info`
- **是否需要认证**: 是

**请求参数**: 无

**响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "userid": "user_b7d8955c-8339-458e-a13b-461b1271e5d4",
    "username": "张三",
    "loginname": "17704051019",
    "tel": "17704051019",
    "telcode": "86",
    "email": "zhangsan@example.com",
    "nickname": "张三",
    "qq": "123456789",
    "wx": "zhangsan_wx",
    "avatar": "https://img2.baidu.com/it/u=...",
    "sex": 1,
    "birthday": "1995-06-15",
    "createTime": "2024-01-01T00:00:00.000Z",
    "score": 100
  }
}
```

---

#### 4.1.3 获取短信验证码

- **请求方法**: GET
- **请求URL**: `/api/mobile_officing/user/smscode`
- **是否需要认证**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号码 |

**请求示例**:

```
GET /api/mobile_officing/user/smscode?phone=13800138000
```

**响应示例**:

```json
{
  "code": 200,
  "message": "验证码发送成功",
  "data": {
    "code": "382916"
  }
}
```

> **注意**: 当前为模拟实现，验证码直接返回在响应中。生产环境应通过短信网关发送。

---

#### 4.1.4 更换手机号

- **请求方法**: POST
- **请求URL**: `/api/mobile_officing/user/changePhone`
- **是否需要认证**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 新手机号 |
| code | string | 是 | 短信验证码 |

**请求示例**:

```json
{
  "phone": "13800138000",
  "code": "382916"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "手机号修改成功"
}
```

---

#### 4.1.5 修改密码

- **请求方法**: POST
- **请求URL**: `/api/mobile_officing/user/changePassword`
- **是否需要认证**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| oldPassword | string | 是 | 原密码 |
| newPassword | string | 是 | 新密码（6-16位） |

**请求示例**:

```json
{
  "oldPassword": "123456",
  "newPassword": "654321"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "密码修改成功"
}
```

---

### 4.2 员工/通讯录模块

#### 4.2.1 获取员工列表

- **请求方法**: GET
- **请求URL**: `/api/mobile_officing/employee/list`
- **是否需要认证**: 是

**请求参数**: 无

**响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "张三",
      "avatar": "https://...",
      "phone": "17704051019",
      "department_id": "65f1a2b3c4d5e6f7a8b9c0d0",
      "department_name": "技术部",
      "team_name": "研发一组",
      "position": "前端工程师",
      "direct_leader": "李四",
      "entry_time": "2023-03-15",
      "remark": "表现优秀",
      "status": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### 4.2.2 获取部门列表（含员工）

- **请求方法**: GET
- **请求URL**: `/api/mobile_officing/employee/department/list`
- **是否需要认证**: 是

**请求参数**: 无

**响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d0",
      "name": "技术部",
      "team": "研发一组",
      "employees": [
        {
          "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
          "name": "张三",
          "avatar": "https://...",
          "phone": "17704051019",
          "department_id": "65f1a2b3c4d5e6f7a8b9c0d0",
          "department_name": "技术部",
          "team_name": "研发一组",
          "position": "前端工程师",
          "direct_leader": "李四",
          "entry_time": "2023-03-15",
          "remark": "",
          "status": 1
        }
      ]
    }
  ]
}
```

---

### 4.3 审批流程模块

#### 4.3.1 获取审批列表（分页）

- **请求方法**: GET
- **请求URL**: `/api/mobile_officing/process/list`
- **是否需要认证**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type_id | number | 否 | 类型筛选：0=全部，1=人事管理，2=行政事务，3=财务类，4=业务相关。默认0 |
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认10 |

**请求示例**:

```
GET /api/mobile_officing/process/list?type_id=1&page=1&pageSize=5
```

**响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 5,
    "items": [
      {
        "_id": "65f1a2b3c4d5e6f7a8b9c0e1",
        "approve_number": "APV202401001",
        "department": "技术部",
        "type_id": "1",
        "type": "请假申请",
        "reason": "家中有事需要处理",
        "begin_date": "2024-01-20",
        "end_date": "2024-01-22",
        "begin_time": "09:00",
        "end_time": "18:00",
        "days": "2",
        "hours": "16",
        "initiator": "张三",
        "department_leader": "李四",
        "personnel_department": "钱七",
        "cc_persons": ["王五"],
        "approve_status": 3,
        "status": 1,
        "created_at": "2024-01-15T10:00:00.000Z",
        "updated_at": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

#### 4.3.2 新增审批申请

- **请求方法**: POST
- **请求URL**: `/api/mobile_officing/process/add`
- **是否需要认证**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type_id | string | 是 | 类型ID |
| type | string | 是 | 申请类型 |
| department | string | 否 | 部门名称 |
| reason | string | 是 | 申请原因 |
| days | string | 否 | 天数 |
| hours | string | 否 | 小时数 |
| begin_date | string | 否 | 开始日期 |
| end_date | string | 否 | 结束日期 |
| begin_time | string | 否 | 开始时间 |
| end_time | string | 否 | 结束时间 |
| initiator | string | 否 | 发起人 |
| department_leader | string | 否 | 部门领导 |
| personnel_department | string | 否 | 人事部门审批人 |
| cc_persons | array | 否 | 抄送人列表 |

**请求示例**:

```json
{
  "type_id": "1",
  "type": "请假申请",
  "department": "技术部",
  "reason": "家中有事需要处理",
  "days": "1",
  "initiator": "张三"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "提交成功"
}
```

---

### 4.4 工资模块

#### 4.4.1 获取工资列表（分页）

- **请求方法**: GET
- **请求URL**: `/api/mobile_officing/salary/list`
- **是否需要认证**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认10 |

**请求示例**:

```
GET /api/mobile_officing/salary/list?page=1&pageSize=5
```

**响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 3,
    "items": [
      {
        "_id": "65f1a2b3c4d5e6f7a8b9c0f1",
        "employee_id": "65f1a2b3c4d5e6f7a8b9c0d1",
        "year": "2024",
        "month": "03",
        "base_salary": "15000",
        "merit_salary": "3500",
        "absence_days": "0",
        "sick_leave_days": "0",
        "welfare_bonus": "2000",
        "social_security_total": "1650",
        "provident_fund_total": "1800",
        "net_salary": "17050",
        "status": 1,
        "job_number": "EMP001",
        "department": "技术部",
        "created_at": "2024-03-01T00:00:00.000Z",
        "updated_at": "2024-03-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

#### 4.4.2 获取工资详情

- **请求方法**: GET
- **请求URL**: `/api/mobile_officing/salary/info`
- **是否需要认证**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 工资单ID |

**请求示例**:

```
GET /api/mobile_officing/salary/info?id=65f1a2b3c4d5e6f7a8b9c0f1
```

**响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0f1",
    "employee_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "year": "2024",
    "month": "03",
    "base_salary": "15000",
    "merit_salary": "3500",
    "absence_days": "0",
    "sick_leave_days": "0",
    "welfare_bonus": "2000",
    "social_security_total": "1650",
    "provident_fund_total": "1800",
    "net_salary": "17050",
    "status": 1,
    "job_number": "EMP001",
    "department": "技术部",
    "created_at": "2024-03-01T00:00:00.000Z",
    "updated_at": "2024-03-01T00:00:00.000Z"
  }
}
```

---

### 4.5 公告模块

#### 4.5.1 获取公告列表

- **请求方法**: GET
- **请求URL**: `/api/mobile_officing/notice/list`
- **是否需要认证**: 是

**请求参数**: 无

**响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c1a1",
      "title": "关于2024年春节放假安排的通知",
      "date": "2024-01-15",
      "read_count": 156,
      "publish_department": "行政部",
      "content": "notice_html/notice1.html"
    }
  ]
}
```

**说明**: 公告的 `content` 字段为相对路径，需要拼接基础URL访问完整内容页面：
```
http://localhost:3002/notice_html/notice1.html
```

---

### 4.6 文件上传模块

#### 4.6.1 上传聊天文件

- **请求方法**: POST
- **请求URL**: `/admin/file/chats/upload`
- **是否需要认证**: 否
- **Content-Type**: multipart/form-data

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | file | 是 | 文件（支持图片、视频等） |

**请求示例**:

```
POST /admin/file/chats/upload
Content-Type: multipart/form-data

------WebKitFormBoundary
Content-Disposition: form-data; name="file"; filename="photo.png"
Content-Type: image/png

<文件二进制数据>
------WebKitFormBoundary--
```

**响应示例**:

```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "url": "/uploads/chats/1710921600000.png"
  }
}
```

**访问URL**: `http://localhost:3002/uploads/chats/1710921600000.png`

---

### 4.7 WebSocket 聊天接口

#### 4.7.1 连接地址

```
ws://localhost:3002/api/chat/connect?room={房间ID}&id={用户ID}&type={聊天类型}
```

**连接参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| room | string | 是 | 聊天房间ID（UUID格式） |
| id | string | 是 | 当前用户ID |
| type | string | 否 | 聊天类型：private=私聊，group=群聊。默认private |

**连接示例**:

```
ws://localhost:3002/api/chat/connect?room=30908286-466b-485e-b673-332db053bd18&id=user_b7d8955c-8339-458e-a13b-461b1271e5d4&type=private
```

#### 4.7.2 服务器推送 - 历史消息

连接成功后，服务器自动推送第一页历史消息。

**接收消息格式**:

```json
{
  "code": 200,
  "type": "list",
  "historyMsgList": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c2a1",
      "media_type": "text",
      "content": "你好，在吗？",
      "is_sender": false,
      "nickname": "张一山",
      "receiver_id": "user_b7d8955c-8339-458e-a13b-461b1271e5d4",
      "room": "30908286-466b-485e-b673-332db053bd18",
      "sender_id": "user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b",
      "status": 2,
      "type": "private",
      "avatar": "https://...",
      "created_at": "2024-03-20T06:30:00.000Z"
    }
  ]
}
```

**无更多历史消息时**:

```json
{
  "code": 404
}
```

#### 4.7.3 客户端请求 - 获取更多历史消息

**发送消息格式**:

```json
{
  "type": "getNewMessageList",
  "page": 2,
  "pageSize": 5,
  "room": "30908286-466b-485e-b673-332db053bd18"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| type | string | 固定值 "getNewMessageList" |
| page | number | 请求的页码 |
| pageSize | number | 每页消息数量 |
| room | string | 聊天房间ID |

#### 4.7.4 客户端发送 - 发送聊天消息

**发送文本消息**:

```json
{
  "content": "明天下午的技术评审会议记得参加",
  "media_type": "text",
  "receiver_id": "user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b",
  "room": "30908286-466b-485e-b673-332db053bd18",
  "sender_id": "user_b7d8955c-8339-458e-a13b-461b1271e5d4",
  "is_sender": true,
  "status": 1,
  "type": "private",
  "avatar": "https://...",
  "nickname": "张三",
  "created_at": "2024-03-20T14:30:00.000Z"
}
```

**发送图片消息**:

```json
{
  "content": "http://localhost:3002/uploads/chats/1710921600000.png",
  "media_type": "image",
  "receiver_id": "user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b",
  "room": "30908286-466b-485e-b673-332db053bd18",
  "sender_id": "user_b7d8955c-8339-458e-a13b-461b1271e5d4",
  "is_sender": true,
  "status": 1,
  "type": "private",
  "avatar": "https://...",
  "nickname": "张三",
  "created_at": "2024-03-20T14:35:00.000Z"
}
```

**发送视频消息**:

```json
{
  "content": "http://localhost:3002/uploads/chats/1710921600001.mp4",
  "media_type": "video",
  "receiver_id": "user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b",
  "room": "30908286-466b-485e-b673-332db053bd18",
  "sender_id": "user_b7d8955c-8339-458e-a13b-461b1271e5d4",
  "is_sender": true,
  "status": 1,
  "type": "private",
  "avatar": "https://...",
  "nickname": "张三",
  "created_at": "2024-03-20T14:40:00.000Z"
}
```

#### 4.7.5 服务器广播 - 新消息通知

当房间内有新消息时，服务器会广播给房间内所有连接的客户端。

**广播消息格式**:

```json
{
  "code": 200,
  "type": "other",
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c2b1",
    "media_type": "text",
    "content": "好的，我会准时参加的",
    "is_sender": true,
    "nickname": "张三",
    "receiver_id": "user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b",
    "room": "30908286-466b-485e-b673-332db053bd18",
    "sender_id": "user_b7d8955c-8339-458e-a13b-461b1271e5d4",
    "status": 1,
    "type": "private",
    "avatar": "https://...",
    "created_at": "2024-03-20T06:35:00.000Z"
  }
}
```

---

## 五、测试数据

系统提供了预置的测试数据，可通过运行种子脚本初始化：

```bash
cd server
node seed/seed.js
```

### 测试账号

| 字段 | 值 |
|------|------|
| 登录账号 | 17704051019 |
| 登录密码 | 123456 |
| 用户昵称 | 张三 |
| 用户ID | user_b7d8955c-8339-458e-a13b-461b1271e5d4 |

### 预置数据内容

- **用户**: 1个测试用户（张三）
- **部门**: 3个部门（技术部、人事部、行政部）
- **员工**: 7名员工，分布在3个部门
- **审批记录**: 5条审批记录（包含各种审批状态）
- **工资单**: 3个月的工资记录（2024年1-3月）
- **公告**: 3条公司公告（含HTML内容页面）
- **聊天消息**: 7条测试聊天记录

---

## 六、部署说明

### 6.1 环境要求

- Node.js >= 16.0.0
- MongoDB >= 5.0

### 6.2 启动步骤

```bash
# 1. 安装依赖
cd server
npm install

# 2. 初始化测试数据
npm run seed

# 3. 启动服务器
npm start
```

### 6.3 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| PORT | 3002 | HTTP服务端口 |
| MONGODB_URI | mongodb://127.0.0.1:27017/mobile_office | MongoDB连接地址 |
| JWT_SECRET | mobile_office_secret_key_2024 | JWT签名密钥 |

### 6.4 启动成功输出

```
MongoDB connected successfully
Server running on port 3002
API: http://localhost:3002/api/mobile_officing/
WebSocket: ws://localhost:3002/api/chat/connect
```
