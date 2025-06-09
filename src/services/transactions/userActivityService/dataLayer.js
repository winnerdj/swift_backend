"use strict";

const models = require('../../../models/swift');
const { sequelize, Sequelize } = models;


exports.createUserLog = async({
	...data
}) => {
	try {
		return await models.user_activity_log.create({
			...data
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.getLatestActivityByUser = async({
	filters
}) => {
	try {
		return await models.user_activity_log.findOne({
			where:{
				...filters
			},
			order: [[ 'createdAt', 'DESC' ]]
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}
