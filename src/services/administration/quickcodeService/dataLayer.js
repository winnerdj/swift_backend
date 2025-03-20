"use strict";

const models = require('../../../models/swift');
const {sequelize, Sequelize} = models;

exports.bulkCreateQuickCode = async({
	dataToInsert
}) => {
	try {
		return await sequelize.transaction(async(t1) => {
			return await models.bas_quick_code.bulkCreate(dataToInsert, {
				logging: false,
				transaction : t1
			});
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}
