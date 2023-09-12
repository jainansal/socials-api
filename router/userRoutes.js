import express from "express"

import {
  getAllUsers,
  userBasicDetails,
  userAdvancedDetails,
  getUserFriends,
  updateBasicDetails,
  searchUser
} from "../controllers/userControllers.js";
import { verifyToken } from "../middleware/verifyToken.js"

export const userRoutes = express.Router()

// Get all users
userRoutes.get('/all', verifyToken, getAllUsers);

// Basic user details (name, username, bio, pfp)
userRoutes.get('/basic/:id', verifyToken, userBasicDetails);

// Advanced user details (friends, requests rec, sent) (only id)
userRoutes.get('/advanced', verifyToken, userAdvancedDetails);

// Get user friends
userRoutes.get('/friends/:id', verifyToken, getUserFriends);

// Update user basic details
userRoutes.put('/basic', verifyToken, updateBasicDetails);

// Search user
userRoutes.get('/search/:name', verifyToken, searchUser);
