// Libraries from npm

import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

// Local imports

import { connectDB } from "./config/db.js"
import { userRoutes } from "./router/userRoutes.js"
import { authRoutes } from "./router/authRoutes.js"
import { postRoutes } from "./router/postRoutes.js"
import { friendRoutes } from "./router/friendRoutes.js"

// Configurations

const app = express()
dotenv.config()
app.use(cors({
  origin: ['http://social-media-jainansal.vercel.app', 'http://127.0.0.1:5173', 'https://s0cials.vercel.app', 'http://social-media-git-master-jainansal.vercel.app'],
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// Routes

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/friends', friendRoutes)

// Database Connection

await connectDB()

// Ports

const PORT = process.env.PORT || 7000
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('Server up and running')
})
