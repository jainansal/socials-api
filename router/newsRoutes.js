import express from "express"

import {
  getNews
} from "../controllers/newsControllers.js"

export const newsRoutes = express.Router();

newsRoutes.get('/', getNews);
