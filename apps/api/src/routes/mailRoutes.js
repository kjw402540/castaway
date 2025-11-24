import express from "express";
import * as mailController from "../controllers/mailController.js";

const router = express.Router();

router.get("/", mailController.getAll);
router.post("/", mailController.create);
router.patch("/:id/read", mailController.markAsRead);
router.delete("/:id", mailController.remove);
router.post("/delete-selected", mailController.removeSelected);

export default router;
