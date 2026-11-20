import express from 'express'
import Ticket from '../models/Ticket.js'
import User from '../models/User.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'
import { body, validationResult } from 'express-validator'

const router = express.Router()

// Get all tickets (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('user_id', 'name email')
      .populate('assigned_to', 'name email')
      .sort({ created_at: -1 })
    
    const formattedTickets = tickets.map(ticket => ({
      id: ticket._id,
      user_id: ticket.user_id._id,
      user_name: ticket.user_id.name,
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      status: ticket.status,
      priority: ticket.priority,
      assigned_to: ticket.assigned_to,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at
    }))
    
    res.json(formattedTickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    res.status(500).json({ message: 'Error fetching tickets' })
  }
})

// Get user's tickets
router.get('/my-tickets', authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user_id: req.user.id })
      .populate('user_id', 'name email')
      .sort({ created_at: -1 })
    
    const formattedTickets = tickets.map(ticket => ({
      id: ticket._id,
      user_id: ticket.user_id._id,
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      status: ticket.status,
      priority: ticket.priority,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at
    }))
    
    res.json(formattedTickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    res.status(500).json({ message: 'Error fetching tickets' })
  }
})

// Get single ticket
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user_id', 'name email')
      .populate('assigned_to', 'name email')

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Check authorization
    if (ticket.user_id._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    res.json({
      id: ticket._id,
      user_id: ticket.user_id._id,
      title: ticket.title,
      description: ticket.description,
      category: ticket.category,
      status: ticket.status,
      priority: ticket.priority,
      assigned_to: ticket.assigned_to,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at
    })
  } catch (error) {
    console.error('Error fetching ticket:', error)
    res.status(500).json({ message: 'Error fetching ticket' })
  }
})

// Create ticket
router.post('/', authMiddleware, [
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('category').isIn(['technical', 'billing', 'general', 'feature-request'])
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { title, description, category } = req.body

  try {
    const ticket = new Ticket({
      user_id: req.user.id,
      title,
      description,
      category,
      status: 'open'
    })

    await ticket.save()

    res.status(201).json({
      id: ticket._id,
      message: 'Ticket created successfully'
    })
  } catch (error) {
    console.error('Error creating ticket:', error)
    res.status(500).json({ message: 'Error creating ticket' })
  }
})

// Update ticket status (admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, [
  body('status').isIn(['open', 'in-progress', 'resolved', 'closed'])
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { status } = req.body

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status, updated_at: new Date() },
      { new: true }
    )

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    res.json({ message: 'Ticket updated successfully' })
  } catch (error) {
    console.error('Error updating ticket:', error)
    res.status(500).json({ message: 'Error updating ticket' })
  }
})

// Update ticket
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Check if user owns the ticket or is admin
    if (ticket.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const { title, description, category } = req.body

    if (title) ticket.title = title
    if (description) ticket.description = description
    if (category) ticket.category = category
    ticket.updated_at = new Date()

    await ticket.save()

    res.json({ message: 'Ticket updated successfully' })
  } catch (error) {
    console.error('Error updating ticket:', error)
    res.status(500).json({ message: 'Error updating ticket' })
  }
})

// Delete ticket
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Check if user owns the ticket or is admin
    if (ticket.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await Ticket.findByIdAndDelete(req.params.id)

    res.json({ message: 'Ticket deleted successfully' })
  } catch (error) {
    console.error('Error deleting ticket:', error)
    res.status(500).json({ message: 'Error deleting ticket' })
  }
})

export default router
