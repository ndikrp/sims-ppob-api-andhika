import multer from "multer";
import createHttpError from "http-errors";
import path from "path";
import { Storage } from "@google-cloud/storage";

const base64Credentials = process.env.BASE64_ENCODED_SERVICE_ACCOUNT;

const decodedCredentials = JSON.parse(
	Buffer.from(base64Credentials, "base64").toString("utf-8")
);

const storage = new Storage({
	projectId: decodedCredentials.project_id,
	credentials: decodedCredentials,
	ssl: true,
});

const bucket = storage.bucket(process.env.GOOGLE_BUCKET_NAME);

const multerStorage = multer.memoryStorage();

const fileFilter = (req, file, next) => {
	const allowedTypes = ["image/jpeg", "image/png"];
	if (!allowedTypes.includes(file.mimetype)) {
		const err = createHttpError(400, {
			status: 102,
			message: "Format Image tidak sesuai",
			data: null,
		});
		return next(err);
	}
	next(null, true);
};

const upload = multer({
	storage: multerStorage,
	limits: { fileSize: 10 * 1024 * 1024 },
	fileFilter,
});

const uploadToGCS = async (req, res, next) => {
	try {
		if (!req.file) {
			req.uploadedFile = null;
			return next();
		}

		const file = req.file;
		const blob = bucket.file(Date.now() + path.extname(file.originalname));
		const blobStream = blob.createWriteStream({ resumable: false });

		blobStream.on("error", (err) =>
			next(createHttpError(500, err.message))
		);

		blobStream.on("finish", async () => {
			try {
				await blob.makePublic();
				req.uploadedFile = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
				next();
			} catch (err) {
				next(createHttpError(500, err.message));
			}
		});

		blobStream.end(file.buffer);
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

export { upload, uploadToGCS };
