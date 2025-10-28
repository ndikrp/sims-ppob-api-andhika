import Joi from "joi";

const RegisterSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"any.required": "Parameter email tidak sesuai format",
		"string.empty": "Parameter email tidak boleh kosong",
		"string.email": "Parameter email tidak sesuai format",
	}),
	first_name: Joi.string()
		.pattern(/^(?!\s*$)[a-zA-Z\s]+$/)
		.required()
		.messages({
			"any.required": "Parameter nama depan tidak boleh kosong",
		}),
	last_name: Joi.string().messages({
		"any.required": "Parameter nama belakang tidak sesuai format",
	}),
	password: Joi.string()
		.min(8)
		.pattern(/^\S+$/, "no spaces")
		.required()
		.messages({
			"string.empty": "Password tidak boleh kosong",
			"string.min": "Password minimal 8 karakter",
			"string.pattern.name": "Password tidak boleh mengandung spasi",
			"any.required": "Password wajib diisi",
		}),
});

const LoginSchema = Joi.object({
	email: Joi.string().email().required().messages({
		"any.required": "Parameter email tidak sesuai format",
		"string.empty": "Parameter email tidak boleh kosong",
		"string.email": "Parameter email tidak sesuai format",
	}),
	password: Joi.string()
		.min(8)
		.pattern(/^\S+$/, "no spaces")
		.required()
		.messages({
			"string.empty": "Password tidak boleh kosong",
			"string.min": "Format password tidak sesuai",
			"string.pattern.name": "Format password tidak sesuai",
			"any.required": "Password wajib diisi",
		}),
});

const UpdateProfileSchema = Joi.object({
	first_name: Joi.string()
		.pattern(/^(?!\s*$)[a-zA-Z\s]+$/)
		.required()
		.messages({
			"any.required": "Parameter nama depan tidak boleh kosong",
		}),
	last_name: Joi.string().messages({
		"any.required": "Parameter nama belakang tidak sesuai format",
	}),
});

export { RegisterSchema, LoginSchema, UpdateProfileSchema };
