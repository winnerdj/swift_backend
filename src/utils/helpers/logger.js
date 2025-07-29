const { createLogger, transports, format, addColors } = require('winston');
const config = require('../../config/config');
const moment = require('moment');

/** Define severity levels to create log files,
	see or hide levels based on the running ENV. */
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4
}

/** This method set the current severity based on
the current NODE_ENV: show all the log levels
if the server was run in development mode; otherwise,
if it was run in production, show only warn and error messages. **/
const level = () => {
	const env = config.NODE_ENV || 'development'
	const isDevelopment = env === 'development'
	return isDevelopment ? 'debug' : 'warn'
}

/** Define different colors for each level.
Colors make the log message more visible,
adding the ability to focus or ignore messages. **/
const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'cyan',
	http: 'magenta',
	debug: 'blue',
}

addColors(colors)

exports.logger = createLogger({
	level: level(),
	levels,
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
		format.colorize({ all: true }),
		format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
	),
	transports: [
		/** Allow the use the console to print the messages */
		new transports.Console(),
		/** Allow to print all the error level messages inside the error.log file\ */
		new transports.File({
			filename: `logs/error_${moment().format('YYYYMM')}.log`,
			level: 'error'
		}),
		/** Allow to print all the http level messages inside the api.log file */
		new transports.File({
			filename: `logs/api_${moment().format('YYYYMM')}.log`,
			level: 'http',
		}),
		/** Allow to print all the error message inside the all.log file
			(also the error log that are also printed inside the error.log( */
		new transports.File({ filename: 'logs/all.log' }),
	]
})

exports.loggerBull = createLogger({
	level: level(),
	levels,
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
		format.colorize({ all: true }),
		format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
	),
	transports: [
		/** Allow the use the console to print the messages */
		new transports.Console(),
		/** Allow to print all the error level messages inside the error.log file\ */
		new transports.File({
			filename: `logs/bull_error_${moment().format('YYYYMM')}.log`,
			level: 'error'
		}),
		/** Allow to print all the error message inside the all.log file
			(also the error log that are also printed inside the error.log( */
		new transports.File({ filename: `logs/bull_all.log` }),
	]
})
