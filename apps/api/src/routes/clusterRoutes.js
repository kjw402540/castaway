import { Router } from "express";
import * as clusterController from "../controllers/clusterController.js";

const router = Router();

router.get("/", clusterController.getAll);
router.get("/:id", clusterController.getById);

export default router;
