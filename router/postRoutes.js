import express from "express"

import {
  createPost,
  getPosts,
  getPost, 
  updatePost, 
  deletePost
} from "../controllers/postControllers.js"
import { verifyToken } from "../middleware/verifyToken.js"

export const postRoutes = express.Router()

// Create
postRoutes.post('/', verifyToken, createPost)

// Get
// Get all posts
postRoutes.get('/', getPosts)
// // Get one post
postRoutes.get('/:id', getPost)

// // Update
postRoutes.put('/:id', verifyToken, updatePost)

// // Delete
postRoutes.delete('/:id', verifyToken, deletePost)