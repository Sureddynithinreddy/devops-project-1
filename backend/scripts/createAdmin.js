import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Import User model
import User from '../models/User.js'

const createAdmin = async () => {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB Atlas')

    // Admin details
    const adminData = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email })
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!')
      console.log('Email:', existingAdmin.email)
      console.log('Role:', existingAdmin.role)
      await mongoose.disconnect()
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 10)

    // Create admin user
    const admin = new User({
      name: adminData.name,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role
    })

    await admin.save()
    console.log('')
    console.log('✅ Admin user created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📧 Email:    admin@example.com')
    console.log('🔐 Password: admin123')
    console.log('👤 Role:     admin')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('🔓 You can now login to the admin portal!')
    console.log('   Go to: http://localhost:5173/login')
    console.log('')

    // Disconnect
    await mongoose.disconnect()
    console.log('✅ Disconnected from MongoDB')
  } catch (error) {
    console.error('❌ Error creating admin:', error.message)
    process.exit(1)
  }
}

createAdmin()
