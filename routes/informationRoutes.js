import authenticated from "../middlewares/authentication.js";
import { Router } from "express";
import {
	handleGetBanners,
	handleGetServices,
} from "../controllers/informationController.js";

const router = Router();

router.get("/banner", handleGetBanners);

router.get("/services", authenticated, handleGetServices);

export default router;
