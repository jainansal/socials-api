import express from "express"

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUsersActivity,
  updateFollowing
} from "../controllers/userControllers.js"
import { verifyToken } from "../middleware/verifyToken.js"

export const userRoutes = express.Router()

// Create
userRoutes.post('/', createUser)

// Get
// Get user activity
userRoutes.get('/activity', getUsersActivity);
// Get single user
userRoutes.get('/:id', getUser)
// Get all users
userRoutes.get('/', getUsers)

// Update
// Update following
userRoutes.put('/following', verifyToken, updateFollowing);
// Basic update
userRoutes.put('/:id', verifyToken, updateUser)

// Delete
userRoutes.delete('/:id', verifyToken, deleteUser)
