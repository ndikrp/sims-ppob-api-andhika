import pkg from "pg";
const { Pool } = pkg;

const useSSL =
	process.env.DB_SSL === "true" ||
	process.env.NODE_ENV === "production" ||
	process.env.DATABASE_URL?.includes("sslmode=require");

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: useSSL ? { rejectUnauthorized: false } : false,
	max: 10,
	idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
	console.error("Unexpected database error:", err);
	process.exit(-1);
});

export default pool;
