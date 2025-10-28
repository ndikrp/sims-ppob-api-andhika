import createHttpError from "http-errors";
import pool from "../database/db.js";

const handleGetBanners = async (req, res, next) => {
	try {
		const result = await pool.query(
			"SELECT banner_name, banner_image, description FROM banners"
		);

		if (result.rowCount === 0) {
			return res.status(404).json({
				status: 104,
				message: "Data banner tidak ditemukan",
				data: null,
			});
		}

		res.status(200).json({
			status: 0,
			message: "Sukses",
			data: result.rows,
		});
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

const handleGetServices = async (req, res, next) => {
	try {
		const result = await pool.query(
			"SELECT service_code, service_name, service_icon, service_tariff FROM services"
		);

		if (result.rowCount === 0) {
			return res.status(404).json({
				status: 104,
				message: "Data service tidak ditemukan",
				data: null,
			});
		}

		res.status(200).json({
			status: 0,
			message: "Sukses",
			data: result.rows,
		});
	} catch (error) {
		next(createHttpError(500, error.message));
	}
};

export { handleGetBanners, handleGetServices };
