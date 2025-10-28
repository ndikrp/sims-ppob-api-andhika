import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: { rejectUnauthorized: false },
	max: 10,
	idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
	console.error("Unexpected database error:", err);
	process.exit(-1);
});

export default pool;
