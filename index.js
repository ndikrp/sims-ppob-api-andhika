import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
	console.log("----------------------------------------------");
	console.log(`Server is running on http://0.0.0.0:${PORT}`);
	console.log("----------------------------------------------");
});
