// src/routes/objectsRoutes.js
import { Router } from "express";
import * as controller from "../controllers/objectsController.js";

const router = Router();

router.get("/", controller.getAll);
router.get("/:diary_id", controller.getByDate);
router.delete("/:object_id", controller.remove);

export default router;
