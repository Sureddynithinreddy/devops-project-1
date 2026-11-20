import mongoose from 'mongoose'

const ticketSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  category: {
    type: String,
    enum: ['technical', 'billing', 'general', 'feature-request'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  attachment_url: {
    type: String,
    default: null
  },
  resolution_notes: {
    type: String,
    default: null
  },
  resolved_at: {
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

// Index for performance
ticketSchema.index({ user_id: 1, status: 1 })
ticketSchema.index({ status: 1 })
ticketSchema.index({ assigned_to: 1 })
ticketSchema.index({ created_at: -1 })

// Update updated_at on save
ticketSchema.pre('save', function(next) {
  this.updated_at = Date.now()
  next()
})

export default mongoose.model('Ticket', ticketSchema)
