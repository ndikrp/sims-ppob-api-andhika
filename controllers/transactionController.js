import createHttpError from "http-errors";
import pool from "../database/db.js";
import generateInvoice from "../utils/generateInvoice.js";
import { v4 as uuidv4 } from "uuid";

const handleGetBalance = async (req, res, next) => {
	try {
		const user = req.user;

		const result = await pool.query(
			"SELECT balance FROM users WHERE id = $1",
			[user.id]
		);

		if (result.rowCount === 0) {
			return res.status(404).json({
				status: 102,
				message: "User tidak ditemukan",
				data: null,
			});
		}

		res.status(200).json({
			status: 0,
			message: "Get Balance Berhasil",
			data: result.rows,
		});
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

const handleGetTransactionHistory = async (req, res, next) => {
	try {
		const user = req.user;

		const limit = parseInt(req.query.limit, 10);

		let query = `
			SELECT 
				invoice_number, 
				transaction_type, 
				description, 
				total_amount, 
				created_on
			FROM transactions
			WHERE user_id = $1
			ORDER BY created_on DESC
		`;

		const values = [user.id];

		if (!isNaN(limit) && limit > 0) {
			query += ` LIMIT $2`;
			values.push(limit);
		}

		const result = await pool.query(query, values);

		return res.status(200).json({
			status: 0,
			message: "Get History Berhasil",
			data: {
				offset: 0,
				limit: isNaN(limit) ? null : limit,
				records: result.rows,
			},
		});
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

const handleTopUp = async (req, res, next) => {
	try {
		const user = req.user;
		const { top_up_amount } = req.body;

		await pool.query("BEGIN");

		const update = `
			UPDATE users
			SET balance = balance + $1,
			    updated_at = NOW()
			WHERE id = $2
			RETURNING balance;
		`;
		const updatedUser = await pool.query(update, [top_up_amount, user.id]);

		if (updatedUser.rowCount === 0) {
			await pool.query("ROLLBACK");
			return res.status(404).json({
				status: 102,
				message: "User tidak ditemukan",
				data: null,
			});
		}

		const invoiceNumber = await generateInvoice();

		await pool.query(
			`INSERT INTO transactions (
				id, user_id, invoice_number, transaction_type, description, total_amount, created_on
			) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
			[
				uuidv4(),
				user.id,
				invoiceNumber,
				"TOPUP",
				"Top Up balance",
				top_up_amount,
			]
		);

		await pool.query("COMMIT");

		return res.status(200).json({
			status: 0,
			message: "Top Up Balance Berhasil",
			data: {
				balance: updatedUser.rows[0].balance,
			},
		});
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

const handleTransaction = async (req, res, next) => {
	try {
		const user = req.user;
		const { service_code } = req.body;

		if (!service_code) {
			return res.status(400).json({
				status: 102,
				message: "Parameter service_code diperlukan",
				data: null,
			});
		}

		await pool.query("BEGIN");

		const serviceQuery = await pool.query(
			`SELECT service_code, service_name, service_tariff
			 FROM services
			 WHERE service_code = $1`,
			[service_code]
		);

		if (serviceQuery.rowCount === 0) {
			await pool.query("ROLLBACK");
			return res.status(404).json({
				status: 102,
				message: "Service atau Layanan tidak ditemukan",
				data: null,
			});
		}

		const service = serviceQuery.rows[0];

		const userQuery = await pool.query(
			`SELECT balance FROM users WHERE id = $1`,
			[user.id]
		);

		if (userQuery.rowCount === 0) {
			await pool.query("ROLLBACK");
			return res.status(404).json({
				status: 102,
				message: "User tidak ditemukan",
				data: null,
			});
		}

		const currentBalance = Number(userQuery.rows[0].balance);

		if (currentBalance < service.service_tariff) {
			await pool.query("ROLLBACK");
			return res.status(400).json({
				status: 102,
				message: "Saldo tidak mencukupi",
				data: null,
			});
		}

		const newBalance = currentBalance - service.service_tariff;
		await pool.query(
			`UPDATE users 
			 SET balance = $1, updated_at = NOW()
			 WHERE id = $2`,
			[newBalance, user.id]
		);

		const invoiceNumber = await generateInvoice();
		const created_on = new Date();

		await pool.query(
			`INSERT INTO transactions 
			 (id, user_id, invoice_number, transaction_type, description, total_amount, created_on)
			 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			[
				uuidv4(),
				user.id,
				invoiceNumber,
				"PAYMENT",
				service.service_name,
				service.service_tariff,
				created_on,
			]
		);

		await pool.query("COMMIT");

		return res.status(200).json({
			status: 0,
			message: "Transaksi berhasil",
			data: {
				invoice_number: invoiceNumber,
				service_code: service.service_code,
				service_name: service.service_name,
				transaction_type: "PAYMENT",
				total_amount: service.service_tariff,
				created_on,
			},
		});
	} catch (error) {
		await pool.query("ROLLBACK");
		next(createHttpError(500, error.message));
	}
};

export {
	handleGetBalance,
	handleGetTransactionHistory,
	handleTransaction,
	handleTopUp,
};
