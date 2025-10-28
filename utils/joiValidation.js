import Joi from "joi";

const RegisterSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"any.required": "Email must be filled",
		"string.empty": "Email cannot be empty",
	}),
	first_name: Joi.string().required().messages({
		"any.required": "First Name must be filled",
		"string.empty": "First Name cannot be empty",
	}),
	last_name: Joi.string().messages({
		"any.required": "Last Name must be a character",
	}),
	password: Joi.string()
		.pattern(
			/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=\S+$).{8,250}$/
		)
		.required()
		.messages({
			"string.empty": "Password cannot be empty",
			"string.min": "Password must be at least 8 characters long",
			"string.max": "Password must not exceed 250 characters",
			"string.pattern.base":
				"Password must contain at least one uppercase letter, one number, one symbol, and no spaces",
			"any.required": "Password is required",
		}),
});

export { RegisterSchema };
