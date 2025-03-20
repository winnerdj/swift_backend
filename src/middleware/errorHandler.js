const { logger, loggerBull } = require('../utils/helpers/logger');
const { NODE_ENV } = require('../config/config');
const router = require('express').Router();

const errorHandler = async(err, req, res, next) => {
	const errStatus = err.statusCode || 500;
	const errMsg = err.message || 'Unhandled error. Please contact the administrator.';

	logger.error({
		status: errStatus,
		success: false,
		message: errMsg,
		stack: NODE_ENV === 'development' ? err.stack : {}
	})

	await res.status(errStatus).json({
		status: errStatus,
		success: false,
		message: errMsg,
		stack: NODE_ENV === 'development' ? err.stack : {}
	})
}

const invalidPathHandler = async(err, req, res, next) => {
	res.status(404).json({
		success: false,
		status: 404,
		message: 'Invalid path.'
	})
}

const bullErrorHandler = async(err) => {
	const errStatus = err.statusCode || 500;
	const errBullModule = err.bullModule;
	const errMsg = err.message ? `${errBullModule} : ${err.message}` : `${errBullModule} : Unhandled error in bull job function. Please contact the administrator.`;

	loggerBull.error({
		status: errStatus,
		success: false,
		message: errMsg,
		stack: err.stack
	})

}

module.exports = {
	errorHandler,
	bullErrorHandler,
	invalidPathHandler
}