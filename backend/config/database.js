import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

let isConnected = false

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI
    
    if (!mongoUri) {
      mongoUri = 'mongodb://localhost:27017/clouddesk'
    }
    
    console.log(`🔗 Connecting to MongoDB...`)
    console.log(`URI: ${mongoUri.substring(0, 50)}...`)
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    })

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    isConnected = true
    return conn
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`)
    console.log(`
    ⚠️  To use the database, add your MongoDB Atlas connection string to .env:
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clouddesk?retryWrites=true&w=majority
    
    Then restart the backend.
    `)
    isConnected = false
  }
}

export default connectDB
export { isConnected }
