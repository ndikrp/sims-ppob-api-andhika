import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
	console.log("----------------------------------------------");
	console.log(`✅ Server is running on http://${HOST}:${PORT}`);
	console.log("----------------------------------------------");
});
