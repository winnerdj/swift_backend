const router = require('express').Router();
const { Buffer } = require('buffer')

const { datahub2MiddlewareUser,
	datahub2MiddlewarePassword,
	datahub2MiddlewareIP } = require('../config/config')

router.use(async(req, res, next) => {
	try {
		/**Validate the IP address of datahub confirmation; Only if datahub2MiddlewareIP is defined*/
		let reqIpAddress = req?.headers['x-real-ip'] || req?.headers['x-forwarded-for'];

		if(datahub2MiddlewareIP !== '' && datahub2MiddlewareIP !== reqIpAddress) {
			throw new Error(`Defined Datahub IP Address mismatch. IP Address: ${reqIpAddress} against expected IP: ${datahub2MiddlewareIP}`)
		}

		/**Check for Basic Authentication */
		let b64auth = (req.headers.authorization || '').split(' ')[1] || ''
		let [user, password] = Buffer.from(b64auth, 'base64').toString().split(':')

		if(!(user === datahub2MiddlewareUser
			&& password === datahub2MiddlewarePassword)) { throw new Error('Authentication failed.')}

		next()

	}
	catch(err) {
		err.statusCode = 498;
		next(err)
	}
})

module.exports = router;