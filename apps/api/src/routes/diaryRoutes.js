// src/routes/diaryRoutes.js
import express from "express";
import * as diaryController from "../controllers/diaryController.js";

const router = express.Router();

router.get("/", diaryController.getAll);
router.get("/:date", diaryController.getByDate);
router.post("/", diaryController.create);
router.delete("/:date", diaryController.remove);

export default router;
