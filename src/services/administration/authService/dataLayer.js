"use strict";

const models = require('../../../models/swift');
const {sequelize, Sequelize} = models;

exports.upsertUserSession = async({
	...data
}) => {
	try {
		return await models.tbl_administration_user_session.upsert({
			...data
		})
	}
	catch(e) {
		throw e
	}
}

exports.getUserSession = async({
	...data
}) => {
	try {
		return await models.tbl_administration_user_session.findOne({
			where : {
				...data
			}
		})
	}
	catch(e) {
		throw e
	}
}
