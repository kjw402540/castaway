import { Router } from "express";
import * as controller from "../controllers/bgmController.js";

const router = Router();

router.get("/diary/:diary_id", controller.getByDiary);

export default router;
