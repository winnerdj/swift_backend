const Joi = require('joi');

const serviceCreateSchema = Joi.object({
	service_name : Joi.string().trim().max(50).required(),
	service_location : Joi.string().trim().max(50).required(),
	service_status : Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid).default(true),
	service_description : Joi.string().trim().max(255).required(),
	service_discipline : Joi.string().trim().max(50).required(),
	no_of_counters : Joi.number().integer().min(1).max(100).default(1),
	counter_prefix : Joi.string().trim().max(50),
	ticket_number_prefix : Joi.string().trim().max(50),
	recall_waiting_flag : Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid).default(true),
	recall_waiting_time : Joi.number().integer().min(1).max(999).default(30),
	service_remarks1 : Joi.string().trim().max(255).empty('').default(null),
	service_remarks2 : Joi.string().trim().max(255).empty('').default(null),
	service_remarks3 : Joi.string().trim().max(255).empty('').default(null),
	createdBy: Joi.string().max(255),
	updatedBy: Joi.string().max(255),
}).unknown(true);

const validateCreateServiceSchema = async (req, res, next) => {
	try {
		let dataToValidate = req?.body;

		if(typeof dataToValidate !== 'object' || !dataToValidate) {
			throw new Error(`Payload invalid.`);
		}

		const { value, error } = serviceCreateSchema.validate(dataToValidate)

		if(error) throw new Error(error);

		req.body = value;

		next();
	} catch (err) {
		err.statusCode = 422;
		next(err);
	}
};

const serviceUpdateSchema = Joi.object({
	service_id : Joi.string().trim().max(50).required(),
	service_name : Joi.string().trim().max(50).required(),
	service_location : Joi.string().trim().max(50).required(),
	service_status : Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid).default(true),
	service_description : Joi.string().trim().max(255).required(),
	service_discipline : Joi.string().trim().max(50).required(),
	no_of_counters : Joi.number().integer().min(1).max(100).default(1),
	counter_prefix : Joi.string().trim().max(50),
	ticket_number_prefix : Joi.string().trim().max(50),
	recall_waiting_flag : Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid).default(true),
	recall_waiting_time : Joi.number().integer().min(1).max(999).default(30),
	service_remarks1 : Joi.string().trim().max(255).empty('').default(null),
	service_remarks2 : Joi.string().trim().max(255).empty('').default(null),
	service_remarks3 : Joi.string().trim().max(255).empty('').default(null),
	createdBy: Joi.string().max(255),
	updatedBy: Joi.string().max(255),
}).unknown(true);

const validateUpdateServiceSchema = async(req, res, next) => {
	try {
		let dataToValidate = req?.body;

		if(typeof dataToValidate !== 'object' || !dataToValidate) {
			throw new Error(`Payload invalid.`);
		}

		const { value, error } = serviceUpdateSchema.validate(dataToValidate);

		if(error) throw new Error(error);

		req.body = value;

		next();
	} catch (err) {
		err.statusCode = 422;
		next(err);
	}
};

exports.validateCreateServiceSchema = validateCreateServiceSchema;
exports.validateUpdateServiceSchema = validateUpdateServiceSchema;