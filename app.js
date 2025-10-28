import express from "express";
import cors from "cors";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./config/logger.js";
import router from "./routes/index.js";

const app = express();

app.use(
	cors({
		methods: "GET, PUT, POST, HEAD",
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
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", router);

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		status: false,
		message: err.message,
	});
});

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
