import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import pool from "../database/db.js";

const authenticated = async (req, res, next) => {
	try {
		const bearerToken = req.headers.authorization;

		if (!bearerToken) {
			return res.status(401).json({
				status: 108,
				message: "Token tidak tidak valid atau kadaluwarsa",
				data: null,
			});
		}

		const token = bearerToken.split("Bearer ")[1];
		if (!token) {
			return res.status(401).json({
				status: 108,
				message: "Token tidak tidak valid atau kadaluwarsa",
				data: null,
			});
		}

		let payload;
		try {
			payload = jwt.verify(token, process.env.JWT_SECRET);
		} catch (err) {
			return res.status(401).json({
				status: 108,
				message: "Token tidak valid atau kadaluwarsa",
				data: null,
			});
		}

		const result = await pool.query(
			"SELECT id, email, first_name, last_name, profile_image FROM users WHERE id = $1",
			[payload.id]
		);

		if (result.rowCount === 0) {
			return res.status(401).json({
				status: 108,
				message: "Token tidak tidak valid atau kadaluwarsa",
				data: null,
			});
		}

		req.user = result.rows[0];
		next();
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

export default authenticated;
