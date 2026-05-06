# 移动办公后台接口文档

## 一、概述

本文档描述移动办公App后端提供的所有API接口，包括RESTful HTTP接口和WebSocket实时通讯接口。

---

## 二、基础信息

### 2.1 基础URL

```
HTTP接口: http://localhost:3002/api/mobile_officing/
WebSocket: ws://localhost:3002/api/chat/connect
文件上传: http://localhost:3002/admin/file/
静态资源: http://localhost:3002/uploads/
公告内容: http://localhost:3002/notice_html/
```

### 2.2 认证方式

除登录接口外，所有接口需要在请求头中携带 `Authorization` 字段进行身份验证。

```
Authorization: Bearer <登录时获取的JWT Token>
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
| 401 | 未登录或token无效或Authorization格式错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 三、数据模型

### 3.1 用户 (User)

**接口**: `GET /api/mobile_officing/user/info`

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
| createdAt | string | 创建时间（ISO 8601格式） |
| updatedAt | string | 更新时间（ISO 8601格式） |

**说明**: 通过`toSafeObject()`方法返回，已过滤`password`、`__v`和`_id`字段。`createdAt`和`updatedAt`由Mongoose timestamps自动生成。

### 3.2 员工 (Employee)

**接口**: `GET /api/mobile_officing/employee/list`

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
| createdAt | string | 创建时间（ISO 8601格式） |
| updatedAt | string | 更新时间（ISO 8601格式） |
| __v | number | Mongoose版本号 |

### 3.3 部门 (Department)

**接口**: `GET /api/mobile_officing/employee/department/list`

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 部门ID（MongoDB ObjectId） |
| name | string | 部门名称 |
| team | string | 团队名称 |
| createdAt | string | 创建时间（ISO 8601格式） |
| updatedAt | string | 更新时间（ISO 8601格式） |
| __v | number | Mongoose版本号 |
| employees | array | 部门员工列表（Employee数组） |

**说明**: `employees`字段由接口动态查询填充，包含该部门下所有在职员工（status=1）的完整信息。使用`.lean()`查询，返回扁平JSON对象。

### 3.4 审批流程 (Process)

**接口**: `GET /api/mobile_officing/process/list`

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 记录ID（MongoDB ObjectId） |
| approve_number | string | 审批编号（自动生成，格式：APV + 时间戳 + 随机字符） |
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
| createdAt | string | 创建时间（ISO 8601格式） |
| updatedAt | string | 更新时间（ISO 8601格式） |
| __v | number | Mongoose版本号 |

### 3.5 工资单 (Salary)

**接口**: `GET /api/mobile_officing/salary/list`, `GET /api/mobile_officing/salary/info`

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 记录ID（MongoDB ObjectId） |
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
| createdAt | string | 创建时间（ISO 8601格式） |
| updatedAt | string | 更新时间（ISO 8601格式） |
| __v | number | Mongoose版本号 |

### 3.6 公告 (Notice)

**接口**: `GET /api/mobile_officing/notice/list`

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 记录ID（MongoDB ObjectId） |
| title | string | 公告标题 |
| date | string | 发布日期 |
| read_count | number | 阅读次数 |
| publish_department | string | 发布部门 |
| content | string | 内容文件路径（拼接基础URL后可访问HTML页面） |
| createdAt | string | 创建时间（ISO 8601格式） |
| updatedAt | string | 更新时间（ISO 8601格式） |
| __v | number | Mongoose版本号 |

### 3.7 聊天房间 (Room)

**接口**: `GET /api/mobile_officing/chat/rooms`

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 记录ID（MongoDB ObjectId） |
| room_id | string | 房间唯一标识（UUID格式） |
| type | string | 房间类型：private=私聊，group=群聊 |
| name | string | 房间名称（群聊名称，私聊为空） |
| avatar | string | 房间头像（群聊头像，私聊为空） |
| members | array | 成员列表，见下方成员子结构 |
| last_message | string | 最后一条消息预览 |
| last_message_time | string | 最后消息时间（ISO 8601格式） |
| created_by | string | 创建者用户ID |
| createdAt | string | 创建时间（ISO 8601格式） |
| updatedAt | string | 更新时间（ISO 8601格式） |

**成员子结构 (members[])**:

| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | string | 用户ID |
| nickname | string | 用户昵称 |
| avatar | string | 用户头像URL |
| role | string | 角色：owner=群主，admin=管理员，member=普通成员 |
| joined_at | string | 加入时间 |
| last_read_at | string | 最后已读时间（用于计算未读数） |

### 3.8 聊天消息 (Message)

**接口**: WebSocket `ws://localhost:3002/api/chat/connect`

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 消息ID（MongoDB ObjectId） |
| media_type | string | 消息类型：time=时间分割线，text=文本，image=图片，video=视频 |
| content | string | 消息内容（文本内容或媒体文件URL） |
| is_sender | boolean | 是否为当前用户发送（由服务端根据接收方自动计算） |
| nickname | string | 发送者昵称 |
| receiver_id | string | 接收者ID |
| room | string | 聊天房间ID |
| sender_id | string | 发送者ID |
| status | number | 消息状态：1=未读，2=已读 |
| type | string | 聊天类型：private=私聊，group=群聊 |
| avatar | string | 发送者头像URL |
| createdAt | string | 创建时间（ISO 8601格式） |
| updatedAt | string | 更新时间（ISO 8601格式） |
| __v | number | Mongoose版本号 |

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
    "score": 100,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
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

**说明**:
- 验证码生成后会在服务端存储，有效期 **5 分钟**
- 同一手机号重复获取会覆盖之前的验证码
- 当前为模拟实现，验证码直接返回在响应中。生产环境应通过短信网关发送，且不返回 code 字段

---

#### 4.1.4 更换手机号

- **请求方法**: POST
- **请求URL**: `/api/mobile_officing/user/changePhone`
- **是否需要认证**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 新手机号 |
| code | string | 是 | 短信验证码（需先调用 `/smscode` 获取） |

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

**错误响应**:

| 场景 | code | message |
|------|------|---------|
| 未获取验证码 | 400 | 请先获取验证码 |
| 验证码已过期（超过5分钟） | 400 | 验证码已过期，请重新获取 |
| 验证码错误 | 400 | 验证码错误 |

**调用流程**:
1. 调用 `GET /smscode?phone=xxx` 获取验证码
2. 在 5 分钟内调用 `POST /changePhone` 提交新手机号和验证码
3. 验证码使用后立即失效，不可重复使用

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

#### 4.1.6 忘记密码（重置密码）

- **请求方法**: POST
- **请求URL**: `/api/mobile_officing/user/resetPassword`
- **是否需要认证**: 否

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 注册手机号 |
| code | string | 是 | 短信验证码（需先调用 `/smscode` 获取） |
| newPassword | string | 是 | 新密码 |

**请求示例**:

```json
{
  "phone": "17704051019",
  "code": "382916",
  "newPassword": "654321"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "密码重置成功"
}
```

**错误响应**:

| 场景 | code | message |
|------|------|---------|
| 参数缺失 | 400 | 手机号、验证码和新密码不能为空 |
| 验证码错误或已过期 | 400 | 验证码错误或已过期 |
| 手机号未注册 | 400 | 该手机号未注册 |

**调用流程**:
1. 调用 `GET /smscode?phone=xxx` 获取验证码
2. 在 5 分钟内调用 `POST /resetPassword` 提交手机号、验证码和新密码
3. 验证码使用后立即失效，不可重复使用

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
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "__v": 0
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
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "__v": 0,
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
          "remark": "表现优秀",
          "status": 1,
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z",
          "__v": 0
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
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z",
        "__v": 0
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
        "createdAt": "2024-03-01T00:00:00.000Z",
        "updatedAt": "2024-03-01T00:00:00.000Z",
        "__v": 0
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
    "createdAt": "2024-03-01T00:00:00.000Z",
    "updatedAt": "2024-03-01T00:00:00.000Z",
    "__v": 0
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

### 4.7 聊天REST接口

#### 4.7.1 创建或获取房间

- **请求方法**: POST
- **请求URL**: `/api/mobile_officing/chat/room`
- **是否需要认证**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 房间类型：private=私聊，group=群聊 |
| targetUserId | string | 私聊必填 | 目标用户ID（私聊时使用） |
| name | string | 群聊必填 | 群聊名称 |
| memberIds | array | 群聊必填 | 群成员用户ID数组（不含当前用户，会自动添加） |

**私聊请求示例**:

```json
{
  "type": "private",
  "targetUserId": "user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b"
}
```

**群聊请求示例**:

```json
{
  "type": "group",
  "name": "项目讨论组",
  "memberIds": ["user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b", "user_xxx"]
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c3a1",
    "room_id": "30908286-466b-485e-b673-332db053bd18",
    "type": "private",
    "name": "",
    "avatar": "",
    "members": [
      {
        "user_id": "user_b7d8955c-8339-458e-a13b-461b1271e5d4",
        "nickname": "张三",
        "avatar": "https://...",
        "role": "owner",
        "joined_at": "2024-03-20T06:30:00.000Z",
        "last_read_at": "2024-03-20T06:30:00.000Z"
      },
      {
        "user_id": "user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b",
        "nickname": "张一山",
        "avatar": "https://...",
        "role": "member",
        "joined_at": "2024-03-20T06:30:00.000Z",
        "last_read_at": "2024-03-20T06:30:00.000Z"
      }
    ],
    "last_message": "",
    "last_message_time": null,
    "created_by": "user_b7d8955c-8339-458e-a13b-461b1271e5d4",
    "createdAt": "2024-03-20T06:30:00.000Z",
    "updatedAt": "2024-03-20T06:30:00.000Z"
  }
}
```

**说明**:
- 私聊具有幂等性：同一对用户重复请求会返回已存在的房间
- `targetUserId` 不能是当前用户自己的ID
- 群聊会自动将当前用户加入成员列表并设为 `owner` 角色

**错误响应**:

| 场景 | code | message |
|------|------|---------|
| 聊天类型无效 | 400 | 聊天类型无效 |
| 缺少目标用户ID | 400 | 缺少目标用户ID |
| 不能和自己聊天 | 400 | 不能和自己聊天 |
| 目标用户不存在 | 404 | 目标用户不存在 |
| 缺少群聊名称 | 400 | 缺少群聊名称 |
| 缺少群成员 | 400 | 缺少群成员 |

---

#### 4.7.2 获取会话列表

- **请求方法**: GET
- **请求URL**: `/api/mobile_officing/chat/rooms`
- **是否需要认证**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认20 |

**请求示例**:

```
GET /api/mobile_officing/chat/rooms?page=1&pageSize=10
```

**响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 4,
    "items": [
      {
        "_id": "65f1a2b3c4d5e6f7a8b9c3a1",
        "room_id": "c9d0e1f2-9999-aaaa-bbbb-ccccddddeeee",
        "type": "group",
        "name": "技术部交流群",
        "avatar": "",
        "last_message": "我的也差不多了，下午提交",
        "last_message_time": "2024-03-20T04:10:00.000Z",
        "unread_count": 3
      },
      {
        "_id": "65f1a2b3c4d5e6f7a8b9c3a2",
        "room_id": "a1b2c3d4-1111-2222-3333-444455556666",
        "type": "private",
        "name": "李华",
        "avatar": "https://...",
        "last_message": "好的，那下午见",
        "last_message_time": "2024-03-20T03:40:00.000Z",
        "unread_count": 3
      },
      {
        "_id": "65f1a2b3c4d5e6f7a8b9c3a3",
        "room_id": "30908286-466b-485e-b673-332db053bd18",
        "type": "private",
        "name": "张一山",
        "avatar": "https://...",
        "last_message": "已经写好了，下午发给你看看",
        "last_message_time": "2024-03-20T02:25:00.000Z",
        "unread_count": 6
      },
      {
        "_id": "65f1a2b3c4d5e6f7a8b9c3a4",
        "room_id": "e5f6a7b8-5555-6666-7777-888899990000",
        "type": "private",
        "name": "赵雯",
        "avatar": "https://...",
        "last_message": "收到了，谢谢",
        "last_message_time": "2024-03-15T08:12:00.000Z",
        "unread_count": 0
      }
    ]
  }
}
```

**说明**:
- 列表按 `last_message_time` 降序排列（最近有消息的房间排在最前）
- 私聊房间的 `name` 和 `avatar` 自动替换为对方的昵称和头像
- `unread_count` 为当前用户的未读消息数（基于 `last_read_at` 计算）

---

#### 4.7.3 获取历史消息

- **请求方法**: GET
- **请求URL**: `/api/mobile_officing/chat/room/:roomId/messages`
- **是否需要认证**: 是

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| roomId | string | 是 | 房间ID（URL路径参数） |
| before | string | 否 | 游标分页：传入ISO时间戳，获取该时间之前的消息 |
| pageSize | number | 否 | 每页条数，默认20 |
| page | number | 否 | 页码，默认1（未传`before`时使用） |

**请求示例**:

```
GET /api/mobile_officing/chat/room/30908286-466b-485e-b673-332db053bd18/messages?pageSize=10

GET /api/mobile_officing/chat/room/30908286-466b-485e-b673-332db053bd18/messages?before=2024-03-20T06:30:00.000Z&pageSize=10
```

**响应示例**:

```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "total": 21,
    "items": [
      {
        "_id": "65f1a2b3c4d5e6f7a8b9c2a1",
        "media_type": "text",
        "content": "早啊，昨天会议的纪要我整理好了",
        "is_sender": false,
        "nickname": "张一山",
        "receiver_id": "user_b7d8955c-8339-458e-a13b-461b1271e5d4",
        "room": "30908286-466b-485e-b673-332db053bd18",
        "sender_id": "user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b",
        "status": 1,
        "type": "private",
        "avatar": "https://...",
        "createdAt": "2024-03-20T02:16:00.000Z",
        "updatedAt": "2024-03-20T02:16:00.000Z"
      }
    ]
  }
}
```

**说明**:
- 消息按时间正序返回（旧消息在前）
- 推荐使用游标分页（`before`参数）实现无限滚动加载，避免页码偏移问题
- 当前用户必须是房间成员，否则返回 404

**错误响应**:

| 场景 | code | message |
|------|------|---------|
| 房间不存在或无权限 | 404 | 房间不存在或无权限访问 |

---

### 4.8 WebSocket 聊天接口

#### 4.8.1 连接地址

```
ws://localhost:3002/api/chat/connect?room={房间ID}&token={JWT令牌}
```

**连接参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| room | string | 是 | 聊天房间ID（通过 `POST /api/mobile_officing/chat/room` 获取） |
| token | string | 是 | JWT认证令牌（登录时获取） |

**连接示例**:

```
ws://localhost:3002/api/chat/connect?room=30908286-466b-485e-b673-332db053bd18&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**认证说明**:
- 连接时服务端会验证JWT令牌的有效性
- 验证通过后会检查用户是否为该房间的成员
- 认证失败时连接会被关闭（code: 1008）
- 用户ID从JWT中解析，无需客户端传递

**连接关闭码**:

| 关闭码 | 说明 |
|--------|------|
| 1008 | 缺少参数、token无效/过期、用户不存在、非房间成员 |

#### 4.8.2 服务器推送 - 历史消息

连接成功后，服务器自动推送第一页历史消息（5条）。同时自动将当前用户在该房间的 `last_read_at` 更新为当前时间，标记所有消息为已读。

**接收消息格式**:

```json
{
  "code": 200,
  "type": "list",
  "historyMsgList": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c2a1",
      "media_type": "text",
      "content": "已经写好了，下午发给你看看",
      "is_sender": true,
      "nickname": "张三",
      "receiver_id": "user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b",
      "room": "30908286-466b-485e-b673-332db053bd18",
      "sender_id": "user_b7d8955c-8339-458e-a13b-461b1271e5d4",
      "status": 1,
      "type": "private",
      "avatar": "https://...",
      "createdAt": "2024-03-20T02:25:00.000Z",
      "updatedAt": "2024-03-20T02:25:00.000Z",
      "__v": 0
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

#### 4.8.3 客户端请求 - 获取更多历史消息

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

#### 4.8.4 客户端发送 - 发送聊天消息

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
  "nickname": "张三"
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
  "nickname": "张三"
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
  "nickname": "张三"
}
```

**说明**: 客户端发送消息时，`createdAt`和`updatedAt`由服务器自动添加，无需客户端传递。

#### 4.8.5 服务器广播 - 新消息通知

当房间内有新消息时，服务器会广播给房间内所有连接的客户端。`is_sender` 字段由服务端根据每个接收方自动计算（比较 `sender_id` 与当前连接用户的ID），无需客户端传递。

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
    "createdAt": "2024-03-20T06:35:00.000Z",
    "updatedAt": "2024-03-20T06:35:00.000Z",
    "__v": 0
  }
}
```

---

## 五、测试数据

系统提供了预置的测试数据，可通过运行种子脚本初始化：

```bash
cd server
npm run seed
```

### 测试账号

| 用户 | 登录账号 | 登录密码 | 用户ID |
|------|----------|----------|--------|
| 张三 | 17704051019 | 123456 | user_b7d8955c-8339-458e-a13b-461b1271e5d4 |
| 张一山 | 13800138001 | 123456 | user_da8add51-4bcc-4d82-a4c3-dcd7a44b527b |
| 李华 | 13800138002 | 123456 | user_a1b2c3d4-1111-2222-3333-444455556666 |
| 赵雯 | 13800138003 | 123456 | user_e5f6a7b8-5555-6666-7777-888899990000 |
| 王五 | 13800138004 | 123456 | user_c9d0e1f2-9999-aaaa-bbbb-ccccddddeeee |

### 预置数据内容

- **用户**: 5个测试用户
  - 张三（loginname: 17704051019，密码: 123456）
  - 张一山（loginname: 13800138001）
  - 李华（loginname: 13800138002）
  - 赵雯（loginname: 13800138003）
  - 王五（loginname: 13800138004）
- **部门**: 3个部门（技术部、人事部、行政部）
- **员工**: 7名员工，分布在3个部门
- **审批记录**: 5条审批记录（包含各种审批状态）
- **工资单**: 3个月的工资记录（2024年1-3月）
- **公告**: 3条公司公告（含HTML内容页面）
- **聊天房间**: 4个房间
  - 张一山私聊（6条未读，最近活跃）
  - 李华私聊（3条未读，最近活跃）
  - 赵雯私聊（0条未读，历史对话）
  - 技术部交流群（群聊，4人，3条未读）
- **聊天消息**: 38条测试聊天记录
  - 消息类型：文本(text)、图片(image)、视频(video)、时间分隔线(time)
  - 覆盖场景：私聊/群聊、已读/未读、多种媒体类型

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
