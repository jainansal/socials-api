import express from "express"

import { verifyToken } from "../middleware/verifyToken.js"

export const userRoutes = express.Router()

// Basic user details (name, username, bio, pfp)
userRoutes.get('/basic/:id', verifyToken, userBasicDetails);

// Posts and friends details
userRoutes.get('/advanced/:id', verifyToken, userAdvancedDetails);
