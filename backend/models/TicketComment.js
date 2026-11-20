import mongoose from 'mongoose'

const ticketCommentSchema = new mongoose.Schema({
  ticket_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment']
  },
  attachment_url: {
    type: String,
    default: null
  },
  is_internal: {
    type: Boolean,
    default: false
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
ticketCommentSchema.index({ ticket_id: 1, created_at: -1 })

export default mongoose.model('TicketComment', ticketCommentSchema)
