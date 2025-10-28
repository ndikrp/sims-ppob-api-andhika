import authenticated from "../middlewares/authentication.js";
import validator from "../lib/validator.js";
import {
	handleGetBalance,
	handleGetTransactionHistory,
	handleTopUp,
	handleTransaction,
} from "../controllers/transactionController.js";
import { Router } from "express";
import { TopUpSchema } from "../utils/joiValidation.js";

const router = Router();

router.get("/balance", authenticated, handleGetBalance);

router.get("/transaction/history", authenticated, handleGetTransactionHistory);

router.post("/transaction", authenticated, handleTransaction);

router.post("/topup", validator(TopUpSchema), authenticated, handleTopUp);

export default router;
