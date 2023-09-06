import express from "express"

import { 
  authLogin,
  authRegister,
  authLogout,
  authInit,
} from "../controllers/authControllers.js"
import { verifyToken } from "../middleware/verifyToken.js"

export const authRoutes = express.Router()

// IsLogged
authRoutes.get('/init', verifyToken, authInit);

// Login
authRoutes.post('/login', authLogin)

// Register
authRoutes.post('/register', authRegister)

// Logout
authRoutes.post('/logout', authLogout)
