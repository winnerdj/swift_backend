const router = require('express').Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Redis = require('redis');

const { jwtSecret, redisConfig } = require('../config/config');

router.use(async(req, res, next) => {
	try {

		/**Validate the x-access-token and user_id in the http headers */
		const headersSchema = Joi.object({
			'x-access-token' : Joi.string()
				.required()
				.pattern(/^[a-zA-Z0-9\w-._]+$/, { name : 'String data type'}),
			'user_id' : Joi.string()
				.required()
				.pattern(/^[a-zA-Z0-9\w-._@]+$/, { name : 'String data type'})
		}).options({ allowUnknown : true })

		const { value, error } = headersSchema.validate(req?.headers);

		if(error) { throw new Error(error) }

		let token = value['x-access-token'];
		let user_id = value['user_id'];

		/**DECODE token using the jwtSecret key*/
		let decode = jwt.verify(token, jwtSecret, (err, decoded) => {
			if (err) {
				if (err.name === 'TokenExpiredError') {
					throw Error('Access Token expired, please relogin to generate new Access and Refresh token.')
				}
				throw Error(err)
			}
			return decoded
		});

		/**Check if access token has a valid session in the redis*/
		let redisClient = Redis.createClient(redisConfig);
		await redisClient.connect();

		let redisRes = await redisClient.json.get(`swift:session:${user_id}`)

		if(redisRes === null) { throw new Error(`Invalid Access Token session for: ${user_id}`) }
		if(redisRes['x-access-token'] !== token) { throw new Error('The current session token does not align with the latest login. Please log in to generate a new token.') }

		req.processor = decode

		next()
	}
	catch(err) {
		err.statusCode = 401;
		next(err)
	}
})

module.exports = router;