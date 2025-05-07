const Joi = require('joi');

const quickcodeCreateSchema = Joi.object({
	//qc_id: Joi.string().trim().replace(/\s+/g, '_').max(50), // Define qc_id in the schema
	qc_type: Joi.string().trim().max(50).required(),
	qc_code: Joi.string().trim().max(50).required(),
	qc_description: Joi.string().trim().max(255).required(),
	qc_status: Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid).default(true),
	qc_alternative_code1: Joi.string().trim().max(255),
	qc_alternative_code2: Joi.string().trim().max(255),
	qc_alternative_code3: Joi.string().trim().max(255),
	qc_remarks1: Joi.string().max(255).trim().empty('').default(null),
	qc_remarks2: Joi.string().max(255).trim().empty('').default(null),
	qc_remarks3: Joi.string().max(255).trim().empty('').default(null),
	createdBy: Joi.string().max(255),
	updatedBy: Joi.string().max(255),
}).unknown(true);

const validateCreateQuickcodeSchema = async (req, res, next) => {
	try {
		let dataToValidate = req?.body;

		if(typeof dataToValidate !== 'object' || !dataToValidate) {
			throw new Error(`Payload invalid.`);
		}

		/** Convert qc_type and qc_code to qc_id */
		const qc_id = dataToValidate?.qc_type.toLowerCase().trim().replace(/\s+/g, '_').concat('@',dataToValidate?.qc_code.toLowerCase().trim().replace(/\s+/g, '_'));

		const { value, error } = quickcodeCreateSchema.validate({
			qc_id,
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

const quickcodeUpdateSchema = Joi.object({
	qc_id: Joi.string().required(), // Define qc_id in the schema
	qc_type: Joi.string().trim().max(50).required(),
	qc_code: Joi.string().trim().max(50).required(),
	qc_status: Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid),
	qc_description: Joi.string().trim().max(255).empty('').default(null),
	qc_alternative_code1: Joi.string().trim().max(255).empty('').default(null),
	qc_alternative_code2: Joi.string().trim().max(255).empty('').default(null),
	qc_alternative_code3: Joi.string().trim().max(255).empty('').default(null),
	qc_remarks1: Joi.string().trim().max(255).empty('').default(null),
	qc_remarks2: Joi.string().trim().max(255).empty('').default(null),
	qc_remarks3: Joi.string().trim().max(255).empty('').default(null),
	updatedBy: Joi.string().max(255),
}).unknown(true);

const validateUpdateQuickcodeSchema = async(req, res, next) => {
	try {
		let dataToValidate = req?.body;

		if(typeof dataToValidate !== 'object' || !dataToValidate) {
			throw new Error(`Payload invalid.`);
		}

		const { value, error } = quickcodeUpdateSchema.validate(dataToValidate);

		if(error) throw new Error(error);

		req.body = value;

		next();
	} catch (err) {
		err.statusCode = 422;
		next(err);
	}
};

exports.validateCreateQuickcodeSchema = validateCreateQuickcodeSchema;
exports.validateUpdateQuickcodeSchema = validateUpdateQuickcodeSchema;