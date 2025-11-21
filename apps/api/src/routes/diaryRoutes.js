// src/routes/diaryRoutes.js
import express from "express";
import * as diaryController from "../controllers/diaryController.js";

const router = express.Router();

// GET /diary
router.get("/", diaryController.getAll);

// GET /diary/:date
router.get("/:date", diaryController.getByDate);

// POST /diary
router.post("/", diaryController.save);

// DELETE /diary/:date
router.delete("/:date", diaryController.remove);

export default router;
