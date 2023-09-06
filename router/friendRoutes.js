import express from "express";

import { verifyToken } from "../middleware/verifyToken";

export const friendRoutes = express.Router();

// Get requests received
friendRoutes.get('/received', verifyToken, getRequestsReceived);

// Get requests sent
friendRoutes.get('/sent', verifyToken, getRequestsSent);

// Send request
friendRoutes.put('/send/:id', verifyToken, sendRequest);

// Accept request
friendRoutes.put('/accept/:id', verifyToken, acceptRequest);

// Reject request
friendRoutes.put('/reject/:id', verifyToken, rejectRequest);
