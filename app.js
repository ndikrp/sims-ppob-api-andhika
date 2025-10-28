import express from "express";
import cors from "cors";
import morgan from "morgan";
import { MORGAN_FORMAT } from "./config/logger.js";
import router from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(morgan(MORGAN_FORMAT));
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "*",
		methods: "GET,HEAD,PUT,POST",
		allowedHeaders:
			"Content-Type, Authorization, Accept-Language, Accept-Encoding",
		exposedHeaders:
			"Content-Type, Authorization, Accept-Language, Accept-Encoding",
		maxAge: 3600,
		credentials: true,
	})
);

app.use(router);

app.get("/", (req, res) => {
	res.status(200).json({
		status: 0,
		message: "Web Service",
		data: null,
	});
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		status: false,
		message: err.message,
		data: null,
	});
});

app.use((req, res) => {
	res.status(404).json({
		status: 404,
		message: "URL Not Found",
		data: null,
	});
});

export default app;
