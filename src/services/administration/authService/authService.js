"use strict";

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const { jwtSecret, jwtExp, jwtErpExp } = require('../../../config/config')

const dataLayer = require('./dataLayer');

exports.generateUserToken = async({
	user_id,
	user_name
}) => {
	try {
		const token = jwt.sign(
			{ user_name, user_id },
			jwtSecret,
			{ expiresIn: jwtExp }
		)

		const decode = jwt.verify(token, jwtSecret)

		return {
			app_key				: user_id,
			expiry				: moment.unix(decode.exp).format('YYYY-MM-DD HH:mm:ss'),
			"x-access-token"	: token
		}
	}
	catch(e) {
		throw e
	}
}

exports.generateErpAccessToken = async({
	user_id,
	user_name
}) => {
	try {
		const refreshToken = uuidv4();

		const token = jwt.sign(
			{ user_name, user_id, refreshToken },
			jwtSecret,
			{ expiresIn: jwtErpExp }
		)

		const decode = jwt.verify(token, jwtSecret)

		return {
			app_key			: user_id,
			expiry			: moment.unix(decode.exp).format('YYYY-MM-DD HH:mm:ss'),
			x_access_token	: token,
			refresh_token	: refreshToken
		}
	}
	catch(e) {
		throw e
	}
}

exports.saveUserSession = async({
	user_id,
	user_name,
	user_token,
	user_token_expiry
}) => {
	try {
		return await dataLayer.upsertUserSession({
			user_id,
			user_name,
			user_token,
			user_token_expiry
		})
	}
	catch(e) {
		throw e
	}
}

exports.getUserSession = async({
	user_id,
	user_name,
	user_token
}) => {
	try {
		return await dataLayer.getUserSession({
			user_id,
			user_name,
			user_token
		})

	}
	catch(e) {
		throw e
	}
}
