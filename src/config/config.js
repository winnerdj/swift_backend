const fs = require('fs');
const path = require('path');
require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET_KEY;
const jwtExp = process.env.JWT_EXPIRY;
const jwtErpExp = process.env.JWT_ERP_EXPIRY;

const axiosDatahubConfig = {
	baseURL: process.env.MIDDLEWARE_2_DATAHUB_BASE_URL,
	timeout: process.env.MIDDLEWARE_2_DATAHUB_TIMEOUT,
	withCredentials: true,
	auth: {
		username: process.env.MIDDLEWARE_2_DATAHUB_USER,
		password: process.env.MIDDLEWARE_2_DATAHUB_PASSWORD,
	},
	headers: {
		'Content-Type': 'application/json'
	}
}

const swiftDbConfig = {
	host: process.env.DB_SWIFT_HOST,
	username: process.env.DB_SWIFT_USER,
	password: process.env.DB_SWIFT_PASSWORD,
	database: process.env.DB_SWIFT_NAME,
	dialect: "mysql",
	charset: 'utf8',
	pool: {
		max: 10,
		min: 1,
		idle: 2000000,
		acquire: 2000000
	},
	dialectOptions: {
		//useUTC: false, //for reading from database
		dateStrings: true,
		typeCast: true
	},
	timezone: '+08:00' /**for writing to database**/
	,logging: true
}

const redisConfig = {
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT
	}
}

const redisBullOptions = {
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT
	}
	,prefix: 'mesi:bull'
	// ,limiter: { /** Limit queue to max 10 job/s per 1000 milliseconds. */
	// 	max: 10,
	// 	duration: 1000
	// }
	// ,maxActiveJobs: 10
}

const podDbConfig = {
	host: process.env.DB_POD_HOST,
	username: process.env.DB_POD_USER,
	password: process.env.DB_POD_PASSWORD,
	database: process.env.DB_POD_NAME,
	dialect: "mssql",
	charset: 'utf8',
	pool: {
		max: 10,
		min: 1,
		idle: 2000000,
		acquire: 2000000
	},
	dialectOptions: {
		//useUTC: false, //for reading from database
		dateStrings: true,
		typeCast: true
	},
	timezone: '+08:00' /**for writing to database**/
	,logging: true
}

const ftpKliConfig = {
	host		: process.env.FTP_KLI_HOST,
	username	: process.env.FTP_KLI_USER,
	password	: process.env.FTP_KLI_PASSWORD,
	port		: process.env.FTP_KLI_PORT
}

const EMAIL_PASS = process.env.EMAIL_PASS
const EMAIL_USER = process.env.EMAIL_USER

module.exports = {
	NODE_ENV
	,PORT
	,jwtSecret
	,jwtExp
	,jwtErpExp
	,swiftDbConfig
	,podDbConfig
	,axiosDatahubConfig
	,redisConfig
	,redisBullOptions
	,ftpKliConfig
	,EMAIL_PASS
	,EMAIL_USER
}