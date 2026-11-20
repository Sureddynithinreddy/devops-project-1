import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticket_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    default: null
  },
  action: {
    type: String,
    required: true
  },
  old_value: {
    type: String,
    default: null
  },
  new_value: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  ip_address: {
    type: String,
    default: null
  },
  user_agent: {
    type: String,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

// Index for performance
activityLogSchema.index({ user_id: 1, created_at: -1 })
activityLogSchema.index({ ticket_id: 1 })

export default mongoose.model('ActivityLog', activityLogSchema)
