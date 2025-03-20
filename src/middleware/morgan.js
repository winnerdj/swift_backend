'use-strict'

const morgan = require('morgan');
const { logger } = require('../../src/utils/helpers/logger');
const config = require('../config/config');

logger.stream = {
	write: message => logger.info(message.trim())
};

const skip = () => {
	return config.NODE_ENV !== "development";
};

module.exports = morgan(
	':remote-addr :remote-user [:date[web]] ":method :url HTTP/:http-version" status: :status ":referrer" ":user-agent" ":res[content-length]bytes @ :response-time ms"',
	{
		stream: logger.stream
	}
);
