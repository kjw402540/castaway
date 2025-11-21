// src/routes/emotionRoutes.js
import express from "express";
import * as emotionController from "../controllers/emotionController.js";

const router = express.Router();

/* ----------------------------------------
   감정 분석 (placeholder)
   POST /emotion
----------------------------------------- */
router.post("/", emotionController.analyze);

export default router;
