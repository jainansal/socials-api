import express from "express";

import { verifyToken } from "../middleware/verifyToken";

export const friendRoutes = express.Router();

// Get requests received
friendRoutes.get('/received', verifyToken, getRequestsReceived);

// Get requests sent
friendRoutes.get('/sent', verifyToken, getRequestsSent);

// Send request
friendRoutes.post('/send/:id', verifyToken, sendRequest);

// Accept/Reject request
friendRoutes.post('/respond/:id', verifyToken, respondRequest);

// Unfriend a user
friendRoutes.put('/unfriend/:id', verifyToken, unfriendUser);
