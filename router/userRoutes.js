import express from "express"

import { verifyToken } from "../middleware/verifyToken.js"

export const userRoutes = express.Router()

// Get all users
userRoutes.get('/all', verifyToken, getAllUsers);

// Basic user details (name, username, bio, pfp)
userRoutes.get('/basic/:id', verifyToken, userBasicDetails);

// Get user friends
userRoutes.get('/friends/:id', verifyToken, getUserFriends);
