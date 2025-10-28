import user from "./userRoutes.js";
import { Router } from "express";

const router = Router();

router.use(user);

export default router;
