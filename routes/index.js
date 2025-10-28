import user from "./userRoutes.js";
import information from "./informationRoutes.js";
import { Router } from "express";

const router = Router();

router.use(user);
router.use(information);

export default router;
