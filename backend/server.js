import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/database.js'
import authRoutes from './routes/auth.js'
import ticketRoutes from './routes/tickets.js'
import adminRoutes from './routes/admin.js'
import { authMiddleware } from './middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
connectDB()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

// Suppress favicon 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).send()
})

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', db: 'MongoDB connected' })
})

// Routes
app.use('/auth', authRoutes)
app.use('/tickets', authMiddleware, ticketRoutes)
app.use('/admin', adminRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
