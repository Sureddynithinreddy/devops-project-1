import express from 'express'
import Ticket from '../models/Ticket.js'
import User from '../models/User.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = express.Router()

// Get dashboard stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments()
    const openTickets = await Ticket.countDocuments({ status: 'open' })
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' })
    const activeUsers = await User.countDocuments({ role: 'customer', is_active: true })

    const stats = {
      totalTickets,
      openTickets,
      resolvedTickets,
      activeUsers
    }

    res.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ message: 'Error fetching statistics' })
  }
})

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select('id name email role created_at')
      .sort({ created_at: -1 })
    
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    }))
    
    res.json(formattedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: 'Error fetching users' })
  }
})

// Get user activity
router.get('/activity', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const activity = await Ticket.find()
      .populate('user_id', 'name email')
      .sort({ updated_at: -1 })
      .limit(50)
    
    const formattedActivity = activity.map(ticket => ({
      id: ticket._id,
      user_id: ticket.user_id._id,
      user_name: ticket.user_id.name,
      user_email: ticket.user_id.email,
      title: ticket.title,
      status: ticket.status,
      updated_at: ticket.updated_at
    }))
    
    res.json(formattedActivity)
  } catch (error) {
    console.error('Error fetching activity:', error)
    res.status(500).json({ message: 'Error fetching activity' })
  }
})

export default router
