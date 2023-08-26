import express from "express"

import { 
  authLogin,
  authRegister,
  authLogout,
  authGetId
} from "../controllers/authControllers.js"
import { verifyToken } from "../middleware/verifyToken.js"

export const authRoutes = express.Router()

// Authorize user from JWT
authRoutes.get('/authorize', verifyToken, authGetId)

// Login
authRoutes.post('/login', authLogin)

// Register
authRoutes.post('/register', authRegister)

// Logout
authRoutes.post('/logout', authLogout)
