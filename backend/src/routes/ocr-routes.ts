import { Router } from "express";
import * as controller from "../controller/ocr-controller";
import { authMiddleware } from "../middlewares/auth-middlewares";
import { upload } from "../middlewares/upload-middleware";

const router = Router();

router.post("/", authMiddleware, upload.single("foto"), controller.escanear);

export default router;