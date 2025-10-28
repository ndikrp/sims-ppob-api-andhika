import createHttpError from "http-errors";
import pool from "../database/db.js";
import generateJWT from "../utils/generateJwt.js";
import { compareHash, saltHash } from "../utils/hashPassword.js";
import { v4 as uuidv4 } from "uuid";

const handleRegister = async (req, res, next) => {
	try {
		const { email, first_name, last_name, password } = req.body;

		const existingUser = await pool.query(
			"SELECT id FROM users WHERE email = $1",
			[email]
		);

		if (existingUser.rowCount > 0) {
			next(createHttpError(409, "Email already exist"));
		}

		const hashedPassword = await saltHash(password);
		const id = uuidv4();

		const insertQuery = `
			INSERT INTO users (id, email, first_name, last_name, password)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id, email, first_name, last_name, profile_image
		`;

		const values = [id, email, first_name, last_name, hashedPassword];
		const result = await pool.query(insertQuery, values);
		const user = result.rows[0];
		const token = generateJWT({ id: user.id, email: user.email });

		res.status(201).json({
			status: true,
			message: "Registration success",
			data: { ...user, token },
		});
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

export { handleRegister };
