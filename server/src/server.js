import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import componentRoutes from './routes/componentRoutes.js'
import buildRoutes from './routes/buildRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// ================================
// MIDDLEWARE
// ================================
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}))

app.use(express.json())

// ================================
// REQUEST LOGGER (dev only)
// ================================
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// ================================
// ROUTES
// ================================
app.use('/api/components', componentRoutes)
app.use('/api',            buildRoutes)

// ================================
// HEALTH CHECK
// ================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

// ================================
// 404 HANDLER
// ================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.path} not found`,
  })
})

// ================================
// ERROR HANDLER
// ================================
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  })
})

// ================================
// START
// ================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📡 API ready at http://localhost:${PORT}/api`)
  console.log(`🔧 Endpoints:`)
  console.log(`   GET  /api/health`)
  console.log(`   GET  /api/components`)
  console.log(`   GET  /api/components?type=cpu`)
  console.log(`   POST /api/generate-build`)
  console.log(`   POST /api/validate-build`)
})