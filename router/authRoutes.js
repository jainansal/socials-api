import express from "express"

import { 
  authLogin,
  authRegister,
  authLogout,
} from "../controllers/authControllers.js"

export const authRoutes = express.Router()

// Login
authRoutes.post('/login', authLogin)

// Register
authRoutes.post('/register', authRegister)

// Logout
authRoutes.post('/logout', authLogout)
