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
			return next(createHttpError(400, "Email sudah ada"));
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

		res.status(200).json({
			status: 0,
			message: "Registrasi berhasil silahkan login",
			data: null,
		});
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

const handleLogin = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const result = await pool.query(
			"SELECT id, email, password, first_name, last_name FROM users WHERE email = $1",
			[email]
		);

		if (result.rowCount === 0) {
			return res.status(401).json({
				status: 103,
				message: "Username atau password salah",
				data: null,
			});
		}

		const user = result.rows[0];

		const isMatch = await compareHash(password, user.password);
		if (!isMatch) {
			return res.status(401).json({
				status: 103,
				message: "Username atau password salah",
				data: null,
			});
		}

		const token = generateJWT({ id: user.id, email: user.email });

		res.status(200).json({
			status: 0,
			message: "Login berhasil",
			data: {
				token,
			},
		});
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

const handleGetProfile = async (req, res, next) => {
	try {
		const { email, first_name, last_name, profile_image } = req.user;
		res.status(200).json({
			status: 0,
			message: "Sukses",
			data: { email, first_name, last_name, profile_image },
		});
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

const handleUpdateProfile = async (req, res, next) => {
	try {
		const user = req.user;
		const { first_name, last_name } = req.body;

		const update = `
      UPDATE users
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name)
      WHERE id = $3
      RETURNING email, first_name, last_name, profile_image
    `;

		const values = [first_name, last_name, user.id];
		const result = await pool.query(update, values);

		if (result.rowCount === 0) {
			return res.status(404).json({
				status: 104,
				message: "Pengguna tidak ditemukan",
				data: null,
			});
		}

		res.status(200).json({
			status: 0,
			message: "Update Profile berhasil",
			data: result.rows[0],
		});
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};
const handleUpdateImage = async (req, res, next) => {
	try {
		const user = req.user;
		const file = req.uploadedFile;

		if (!file) {
			return res.status(400).json({
				status: 101,
				message: "File Image tidak ditemukan",
				data: null,
			});
		}

		const update = `
      UPDATE users
      SET profile_image = $1
      WHERE email = $2
      RETURNING email, first_name, last_name, profile_image
    `;

		const values = [file, user.email];
		const result = await pool.query(update, values);

		if (result.rowCount === 0) {
			return res.status(404).json({
				status: 104,
				message: "Pengguna tidak ditemukan",
				data: null,
			});
		}

		res.status(200).json({
			status: 0,
			message: "Update Profile Image berhasil",
			data: result.rows[0],
		});
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

export {
	handleRegister,
	handleLogin,
	handleGetProfile,
	handleUpdateProfile,
	handleUpdateImage,
};
