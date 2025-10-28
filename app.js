import express from "express";
import cors from "cors";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./config/logger.js";

const app = express();

app.use(
	cors({
		methods: "GET, PUT, PATCH, POST, HEAD",
		allowedHeaders:
			"Content-Type, Authorization, Accept-Language, Accept-Encoding",
		exposedHeaders:
			"Content-Type, Authorization, Accept-Language, Accept-Encoding",
		maxAge: 3600,
		credentials: true,
	})
);

app.use(express.json());
app.use(morgan(MORGAN_FORMAT));

app.use((req, res) => {
	const url = req.url;
	const method = req.method;
	res.status(404).json({
		status: false,
		code: 404,
		method,
		url,
		message: "Page Not found!",
	});
});

export default app;
