import validator from "../lib/validator.js";
import { Router } from "express";
import { upload, uploadToGCS } from "../middlewares/uploadFile.js";
import {
	handleGetProfile,
	handleLogin,
	handleRegister,
	handleUpdateImage,
	handleUpdateProfile,
} from "../controllers/userController.js";
import {
	LoginSchema,
	RegisterSchema,
	UpdateProfileSchema,
} from "../utils/joiValidation.js";
import authenticated from "../middlewares/authentication.js";

const router = Router();

router.post("/register", validator(RegisterSchema), handleRegister);

router.post("/login", validator(LoginSchema), handleLogin);

router.get("/profile", authenticated, handleGetProfile);

router.put(
	"/profile/update",
	validator(UpdateProfileSchema),
	authenticated,
	handleUpdateProfile
);

router.put(
	"/profile/image",
	authenticated,
    upload.single("file"),
    uploadToGCS,
	handleUpdateImage
);

export default router;
