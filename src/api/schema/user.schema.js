const router = require('express').Router();
const Joi = require('joi');
// const passwordComplexity = require('joi-password-complexity');

// const complexityOptions = {
// 	min: 10,
// 	max: 30,
// 	lowerCase: 1,
// 	upperCase: 1,
// 	numeric: 1,
// 	symbol: 1,
// 	requirementCount: 2,
// };

const userCreateSchema = Joi.object({
	user_role: Joi.string().max(50).required(),
	// user_password: passwordComplexity(complexityOptions), //Joi.string().max(255),
	user_status: Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid).default(true),
	user_email: Joi.string().email().max(255),
	user_name: Joi.string().max(50).required(),
	user_first_name: Joi.string().max(255),
	user_middle_name: Joi.string().max(255),
	user_last_name: Joi.string().max(255),
	user_contact_person: Joi.string().allow(null).max(255),
	user_contact_no: Joi.number().integer(),
	user_address: Joi.string().max(255),
	createdBy: Joi.string().max(255),
	updatedBy: Joi.string().max(255),
}).unknown(true);

const validateCreateUserSchema = async (req, res, next) => {
	try {
		let dataToValidate = req?.body;

		if (typeof dataToValidate !== 'object' || !dataToValidate) {
			throw new Error(`Payload invalid.`);
		}

		dataToValidate.user_id = dataToValidate?.user_name;

		const { value, error } = userCreateSchema.validate(dataToValidate);

		if (error) throw new Error(error);

		req.body = value;

		next();
	} catch (err) {
		err.statusCode = 422;
		next(err);
	}
};

const userUpdateSchema = Joi.object({
	user_role: Joi.string().max(50).required(),
	// user_password: passwordComplexity(complexityOptions), //Joi.string().max(50),
	user_status: Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid).default(true),
	user_email: Joi.string().email().required().max(50),
	user_name: Joi.string().max(50).required(),
	user_first_name: Joi.string().max(255),
	user_middle_name: Joi.string().max(255),
	user_last_name: Joi.string().max(255),
	// user_contact_person: Joi.string().optional(),
	user_contact_no: Joi.number().integer(),
	user_address: Joi.string().max(255),
	createdBy: Joi.string().max(255),
	updatedBy: Joi.string().max(255),
}).unknown(true);

const validateUpdateUserSchema = async (req, res, next) => {
	try {
		console.log('req.body:', req.body);
		let dataToValidate = req?.body;

		if (typeof dataToValidate !== 'object' || !dataToValidate) {
			throw new Error(`Payload invalid.`);
		}

		dataToValidate.user_id = dataToValidate?.user_name;

		const { value, error } = userUpdateSchema.validate(dataToValidate);

		if (error) throw new Error(error);

		req.body = value;

		next();
	} catch (err) {
		err.statusCode = 422;
		next(err);
	}
};

// Export middleware functions instead of using router.use()
exports.validateCreateUserSchema = validateCreateUserSchema;
exports.validateUpdateUserSchema = validateUpdateUserSchema;
