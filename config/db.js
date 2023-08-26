import mongoose from "mongoose"

export const connectDB = async () => {
  console.log('...Connecting Database...')
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL)
    console.log(`Mongo DB connected: ${connection.connection.host}`)
  } catch (err) {
    console.log(`Error: ${err}`)
    process.exit()
  }
}
