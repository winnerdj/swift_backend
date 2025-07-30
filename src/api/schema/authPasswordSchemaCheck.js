const router = require('express').Router();
const Joi = require('joi');

const schema = Joi.object({
	user_id: Joi.string()
		.required(),
	current_password: Joi.string()
		.required(),
	new_password: Joi.string()
		.strict()
		.pattern(/^[a-zA-Z0-9\w!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/, { name : '"Alphanumeric and special characters: @!_-."'})
		.min(5)
		.max(100)
		.required(),

}).options({ allowUnknown : true })

router.use(async(req, res, next) => {
	try {
		let dataToValidate = req?.body;

		if(typeof dataToValidate !== 'object' || !dataToValidate ) { throw new Error(`Payload invalid.`)};

		const { value, error } = schema.validate(dataToValidate);

		if(error) throw new Error(error);

		req.body = value;

		next();
	} catch(err) {
		err.statusCode = 422;
		next(err);
	}
})

module.exports = router;