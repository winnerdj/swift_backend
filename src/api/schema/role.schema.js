const Joi = require('joi');

const roleCreateSchema = Joi.object({
	//role_id: Joi.string().trim().replace(/\s+/g, '_').max(50), // Define role_id in the schema
	role_name: Joi.string().trim().max(50).required(),
	role_status: Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid).default(true),
	role_name: Joi.string().trim().max(50).empty('').default(null),
	role_description: Joi.string().trim().max(255).empty('').default(null),
	role_remarks1: Joi.string().trim().max(255).empty('').default(null),
	role_remarks2: Joi.string().trim().max(255).empty('').default(null),
	role_remarks3: Joi.string().trim().max(255).empty('').default(null),
	createdBy: Joi.string().trim().max(255).empty('').default(null),
	updatedBy: Joi.string().trim().max(255).empty('').default(null),
}).unknown(true);

const validateCreateRoleSchema = async (req, res, next) => {
	try {
		let dataToValidate = req?.body;

		if(typeof dataToValidate !== 'object' || !dataToValidate) {
			throw new Error(`Payload invalid.`);
		}

		const { value, error } = roleCreateSchema.validate({
			'role_id': dataToValidate?.role_name.toLowerCase().replace(/\s+/g, '_'), // Convert role_name to role_id
			...dataToValidate
		})

		if(error) throw new Error(error);

		req.body = value;

		next();
	} catch (err) {
		err.statusCode = 422;
		next(err);
	}
};

const roleUpdateSchema = Joi.object({
	role_status: Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid),
	role_name: Joi.string().trim().max(50).required(),
	role_description: Joi.string().trim().max(255).empty('').default(null),
	role_remarks1: Joi.string().trim().max(255).empty('').default(null),
	role_remarks2: Joi.string().trim().max(255).empty('').default(null),
	role_remarks3: Joi.string().trim().max(255).empty('').default(null),
	updatedBy: Joi.string().trim().max(255).empty('').default(null),
}).unknown(true);

const validateUpdateRoleSchema = async (req, res, next) => {
	try {
		let dataToValidate = req?.body;

		if(typeof dataToValidate !== 'object' || !dataToValidate) {
			throw new Error(`Payload invalid.`);
		}

		const { value, error } = roleUpdateSchema.validate(dataToValidate);

		if(error) throw new Error(error);

		req.body = value;

		next();
	} catch (err) {
		err.statusCode = 422;
		next(err);
	}
};

exports.validateCreateRoleSchema = validateCreateRoleSchema;
exports.validateUpdateRoleSchema = validateUpdateRoleSchema;