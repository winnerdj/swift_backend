"use strict";

const models = require('../../../models/swift');
const {sequelize, Sequelize} = models;

exports.bulkCreateDataMap = async({
	dataToInsert
}) => {
	try {
		return await sequelize.transaction(async(t1) => {
			return await models.tbl_administration_data_map.bulkCreate(dataToInsert, {
				logging: false,
				transaction : t1,
				updateOnDuplicate: ['map_to_data','map_other_data','map_formula', 'map_desc', 'map_status']
			});
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.getMappingData = async({
	filters
}) => {
	try {
		if(!filters.user_id || !filters.map_transaction_type)
		throw new Error('Missing filters to fetch data used in transform and map data.')

		return await sequelize.query(`
			SELECT dm.*
			FROM tbl_administration_user user 
			LEFT JOIN tbl_administration_data_map dm ON dm.map_customer = user.user_customer
			WHERE 1=1
				AND user.user_id = '${filters.user_id}'
				AND dm.map_status = true
				AND dm.map_transaction_type = '${filters.map_transaction_type}'
			`,
			{
				type:sequelize.QueryTypes.SELECT
			})
		.then((result) => {
			return JSON.parse(JSON.stringify(result))
		})
	}
	catch(e) {
		throw e
	}
}
