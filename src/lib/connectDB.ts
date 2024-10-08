import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env and .env.local'
  )
}

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
  } catch (e) {
    throw e
  }
}

export default connectDB