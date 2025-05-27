const Joi = require('joi');

const ticketCreateSchema = Joi.object({
	// ticket_id : Joi.string().trim().max(50).required(),
	ticket_service : Joi.string().trim().max(50).required(),
	// ticket_status : Joi.string().trim().max(50).required(),
	// ticket_issue_datetime : Joi.string().trim().max(50).required(),
	ticket_level : Joi.number().integer().min(1).max(100).default(1),
	// ticket_parent_reference : Joi.string().trim().max(50).required(),
	// ticket_head_reference : Joi.string().trim().max(50).required(),
	// ticket_counter : Joi.string().trim().max(50).required(),
	// ticket_support : Joi.string().trim().max(50).required(),
	// ticket_create_datetime : Joi.string().trim().max(50).required(),
	// ticket_queue_datetime : Joi.string().trim().max(50).required(),
	// ticket_assigned_datetime : Joi.string().trim().max(50).required(),
	// ticket_now_serving_datetime : Joi.string().trim().max(50).required(),
	// ticket_served_datetime : Joi.string().trim().max(50).required(),
	// ticket_no_show_datetime : Joi.string().trim().max(50).required(),
	// ticket_cancelled_datetime : Joi.string().trim().max(50).required(),
	// ticket_reason_code : Joi.string().trim().max(50).required(),
	ticket_trip_number : Joi.string().trim().max(255).empty('').default(null),
	ticket_trucker_id : Joi.string().trim().max(255).empty('').default(null),
	ticket_trucker_name : Joi.string().trim().max(255).empty('').default(null),
	ticket_vehicle_type : Joi.string().trim().max(255).empty('').default(null),
	ticket_plate_num : Joi.string().trim().max(255).empty('').default(null),
	ticket_remarks1 : Joi.string().trim().max(255).empty('').default(null),
	ticket_remarks2 : Joi.string().trim().max(255).empty('').default(null),
	ticket_remarks3 : Joi.string().trim().max(255).empty('').default(null),
	createdBy: Joi.string().max(255),
	updatedBy: Joi.string().max(255),
}).unknown(true);

const validateCreateTicketSchema = async (req, res, next) => {
	try {
		let dataToValidate = req?.body;

		if(typeof dataToValidate !== 'object' || !dataToValidate) {
			throw new Error(`Payload invalid.`);
		}

		const { value, error } = ticketCreateSchema.validate(dataToValidate)

		if(error) throw new Error(error);

		req.body = value;

		next();
	} catch (err) {
		err.statusCode = 422;
		next(err);
	}
};

const ticketUpdateSchema = Joi.object({
	ticket_id : Joi.string().trim().max(50).required(),
	ticket_name : Joi.string().trim().max(50).required(),
	ticket_location : Joi.string().trim().max(50).required(),
	ticket_status : Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid).default(true),
	ticket_description : Joi.string().trim().max(255).required(),
	ticket_discipline : Joi.string().trim().max(50).required(),
	no_of_counters : Joi.number().integer().min(1).max(100).default(1),
	counter_prefix : Joi.string().trim().max(50),
	ticket_number_prefix : Joi.string().trim().max(50),
	recall_waiting_flag : Joi.alternatives().try(Joi.boolean(), Joi.number().valid(0, 1), Joi.string().valid).default(true),
	recall_waiting_time : Joi.number().integer().min(1).max(999).default(30),
	ticket_remarks1 : Joi.string().trim().max(255).empty('').default(null),
	ticket_remarks2 : Joi.string().trim().max(255).empty('').default(null),
	ticket_remarks3 : Joi.string().trim().max(255).empty('').default(null),
	createdBy: Joi.string().max(255),
	updatedBy: Joi.string().max(255),
}).unknown(true);

const validateUpdateTicketSchema = async(req, res, next) => {
	try {
		let dataToValidate = req?.body;

		if(typeof dataToValidate !== 'object' || !dataToValidate) {
			throw new Error(`Payload invalid.`);
		}

		const { value, error } = ticketUpdateSchema.validate(dataToValidate);

		if(error) throw new Error(error);

		req.body = value;

		next();
	} catch (err) {
		err.statusCode = 422;
		next(err);
	}
};

exports.validateCreateTicketSchema = validateCreateTicketSchema;
exports.validateUpdateTicketSchema = validateUpdateTicketSchema;