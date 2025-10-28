import validator from "../lib/validator.js";
import { Router } from "express";
import { handleRegister } from "../controllers/userController.js";
import { RegisterSchema } from "../utils/joiValidation.js";

const router = Router();

router.post("/register", validator(RegisterSchema), handleRegister);

export default router
