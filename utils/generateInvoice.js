import pool from "../database/db.js";

const generateInvoice = async () => {
	const now = new Date();
	const day = String(now.getDate()).padStart(2, "0");
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const year = now.getFullYear();
	const datePart = `${day}${month}${year}`;

	const result = await pool.query(
		`SELECT invoice_number
     FROM transactions
     WHERE invoice_number LIKE $1
     ORDER BY created_on DESC
     LIMIT 1`,
		[`INV${datePart}-%`]
	);

	let newNumber = "001";

	if (result.rows.length > 0) {
		const lastInvoice = result.rows[0].invoice_number;
		const lastNumber = parseInt(lastInvoice.split("-")[1]);
		newNumber = String(lastNumber + 1).padStart(3, "0");
	}

	return `INV${datePart}-${newNumber}`;
};

export default generateInvoice;
