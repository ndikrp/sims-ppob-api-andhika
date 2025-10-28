import createHttpError from "http-errors";

const validator = (schema) => {
	return async (req, res, next) => {
		try {
			const validated = await schema.validateAsync(req.body);
			req.body = validated;
			next();
		} catch (error) {
			if (error.isJoi) {
				return next(createHttpError(422, { message: error.message }));
			}
			next(createHttpError(500));
		}
	};
};

export default validator;
