// src/middleware/errorHandler.js

const { logger, loggerBull } = require('../utils/helpers/logger');
const { NODE_ENV } = require('../config/config');
const { UniqueConstraintError, ValidationError } = require('sequelize');

const errorHandler = async(err, req, res, next) => {
	let errStatus = err.statusCode || 500;
	let errMsg = 'Unhandled error. Please contact the administrator.';

	if(err instanceof UniqueConstraintError) { // Use the imported class name
		errMsg = 'A unique constraint was violated.';

		if(err.errors && err.errors.length > 0) {
			const firstError = err.errors[0];

			/** Customize the message based on the specific error */
			if(firstError.message) {
				errMsg = firstError.message;
			}

			let fieldViolated = firstError.path;
			let valueViolated = firstError.value;

			if(fieldViolated === 'PRIMARY' && valueViolated) {
				errMsg = `The ID '${valueViolated}' already exists.`;
			}
			else if (fieldViolated) {
				errMsg = `The value '${valueViolated}' for ${fieldViolated} already exists.`;
			}
		}
	}
	else if(err instanceof ValidationError) {
		errMsg = 'Validation failed for one or more fields.';
		if(err.errors && err.errors.length > 0) {
			errMsg = err.errors[0].message
		}
	}
	else if(err.name === 'SequelizeDatabaseError') {
		errMsg = 'A database error occurred.';

		if(NODE_ENV === 'development' && err.parent && err.parent.sqlMessage) {
			errMsg = `Database error: ${err.parent.sqlMessage}`;
		}
	}

	if(NODE_ENV === 'development') {
		console.error(err);
	}

	logger.error({
		status: errStatus,
		success: false,
		message: errMsg,
		stack: NODE_ENV === 'development' ? err.stack : {}
	});

	await res.status(errStatus).json({
		status: errStatus,
		success: false,
		message: errMsg,
		stack: NODE_ENV === 'development' ? err.stack : undefined // Don't send empty object if not in dev
	});
};

const invalidPathHandler = async(req, res, next) => {
	res.status(404).json({
		success: false,
		status: 404,
		message: 'Invalid path.'
	});
};

const bullErrorHandler = async(err) => {
	const errStatus = err.statusCode || 500;
	const errBullModule = err.bullModule;
	const errMsg = err.message ? `${errBullModule} : ${err.message}` : `${errBullModule} : Unhandled error in bull job function. Please contact the administrator.`;

	loggerBull.error({
		status: errStatus,
		success: false,
		message: errMsg,
		stack: err.stack
	});
};

module.exports = {
	errorHandler,
	bullErrorHandler,
	invalidPathHandler
};