import "dotenv/config";
import fs from "fs";
import path from "path";
import pool from "./db.js";

const __dirname = path.resolve();

async function runMigrations(direction = "up") {
	const migrationsDir = path.join(__dirname, "database", "migrations");
	const files = fs
		.readdirSync(migrationsDir)
		.filter((f) => {
			if (direction === "up")
				return f.endsWith(".sql") && !f.endsWith(".down.sql");
			return f.endsWith(".down.sql");
		})
		.sort();

	if (files.length === 0) {
		console.log(`No migration files found for direction: ${direction}`);
		await pool.end();
		return;
	}

	for (const file of files) {
		const filePath = path.join(migrationsDir, file);
		const sql = fs.readFileSync(filePath, "utf8");
		try {
			await pool.query(sql);
			console.log(`Migration ${file} completed`);
		} catch (err) {
			console.error(err.message);
			process.exit(1);
		}
	}

	await pool.end();
	console.log(`All ${direction.toUpperCase()} migrations finished`);
}

const direction = process.argv[2] || "up";
runMigrations(direction);
