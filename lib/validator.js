import createHttpError from "http-errors";

const validator = (schema) => {
	return async (req, res, next) => {
		try {
			const validated = await schema.validateAsync(req.body, {
				abortEarly: false,
			});
			req.body = validated;
			next();
		} catch (error) {
			if (error.isJoi) {
				return res.status(400).json({
					status: 102,
					message: error.details[0].message,
					data: null,
				});
			}
			next(createHttpError(500, error.message));
		}
	};
};

export default validator;
