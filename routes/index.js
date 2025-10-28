import user from "./userRoutes.js";
import information from "./informationRoutes.js";
import transaction from "./transactionRoutes.js";
import { Router } from "express";

const router = Router();

router.use(user);
router.use(information);
router.use(transaction);

export default router;
