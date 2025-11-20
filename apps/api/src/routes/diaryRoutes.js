import { Router } from "express";
import * as controller from "../controllers/diaryController.js";

const router = Router();

router.get("/", controller.getAll);
router.get("/:date", controller.getByDate);
router.post("/", controller.save);
router.delete("/:date", controller.remove);

export default router;
