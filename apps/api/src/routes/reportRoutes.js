// src/routes/reportRoutes.js
import express from "express";
import * as reportController from "../controllers/reportController.js";

const router = express.Router();

// GET /report/weekly
router.get("/weekly", reportController.getWeekly);

// GET /report/history
router.get("/history", reportController.getHistory);

// GET /report/:id
router.get("/:id", reportController.getById);

// POST /report
router.post("/", reportController.save);

export default router;
