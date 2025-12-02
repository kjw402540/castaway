// --------------------------------------------------------
// apps/api/src/routes/notificationRoutes.js
// Notification Router
// --------------------------------------------------------

import express from "express";
import * as controller from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", controller.getList);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.patch("/:id/read", controller.markAsRead);
router.delete("/", controller.removeBulk);
router.delete("/:id", controller.remove);

export default router;
