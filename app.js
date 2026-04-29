const express = require('express')
const cors = require('cors')
const path = require('path')
const http = require('http')
const connectDB = require('./config/db')
const { setupWebSocket } = require('./websocket/chat')

// Import routes
const userRoutes = require('./routes/user')
const employeeRoutes = require('./routes/employee')
const processRoutes = require('./routes/process')
const salaryRoutes = require('./routes/salary')
const noticeRoutes = require('./routes/notice')
const fileRoutes = require('./routes/file')

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/notice_html', express.static(path.join(__dirname, 'notice_html')))

// API routes
app.use('/api/mobile_officing/user', userRoutes)
app.use('/api/mobile_officing/employee', employeeRoutes)
app.use('/api/mobile_officing/process', processRoutes)
app.use('/api/mobile_officing/salary', salaryRoutes)
app.use('/api/mobile_officing/notice', noticeRoutes)
app.use('/admin/file', fileRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ code: 200, message: 'Mobile Office Server is running' })
})

// Create HTTP server
const server = http.createServer(app)

// Setup WebSocket
setupWebSocket(server)

// Connect to MongoDB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`API: http://localhost:${PORT}/api/mobile_officing/`)
    console.log(`WebSocket: ws://localhost:${PORT}/api/chat/connect`)
  })
})
