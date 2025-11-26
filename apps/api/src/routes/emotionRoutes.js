// src/routes/emotionRoutes.js
import express from "express";
import * as emotionController from "../controllers/emotionController.js";

const router = express.Router();

router.post("/", emotionController.analyze);

export default router;
