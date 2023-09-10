import express from "express"

import {
  newPost,
  getAllPosts,
  getTrendingPosts,
  getFriendsPosts,
  getUserPosts,
  getPostComments,
  updateLikes,
  addComment,
  deletePost
} from "../controllers/postControllers.js";
import { verifyToken } from "../middleware/verifyToken.js"

export const postRoutes = express.Router()

// New post
postRoutes.post('/', verifyToken, newPost);

// Get all posts
postRoutes.get('/all', verifyToken, getAllPosts);

// Get Trending Posts
postRoutes.get('/trending', verifyToken, getTrendingPosts);

// Get Friends' Posts
postRoutes.get('/friends', verifyToken, getFriendsPosts);

// Get User posts
postRoutes.get('/:id', verifyToken, getUserPosts);

// Get comments
postRoutes.get('/comments/:id', verifyToken, getPostComments);

// Update likes
postRoutes.put('/likes/:id', verifyToken, updateLikes);

// Add comment
postRoutes.post('/comments/:id', verifyToken, addComment);

// Delete post
postRoutes.delete('/:id', verifyToken, deletePost);
