import express from "express"

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

// Get comments
postRoutes.get('/comments/:id', verifyToken, getPostComments);

// Update likes
postRoutes.put('/likes/:id', verifyToken, updateLikes);

// Add comment
postRoutes.put('/comments/:id', verifyToken, updateComments);

// Delete post
postRoutes.delete('/', verifyToken, deletePost);
