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
	user_id}) => {
	try {
		return await models.user_activity_log.findOne({
			where:{
				user_id
			},
			order: [[ 'createdAt', 'DESC' ]]
			,include: [
				{
					model: models.bas_service,
					foreignKey: 'service_id',
					as: 'srv_user_activity',
					attributes: ['service_id', 'service_name', 'service_location']
				},
				{
					model: models.bas_quick_code,
					foreignKey: 'service_id',
					as: 'qc_loc_user_activity',
					attributes: ['qc_description'],
					where: {
						qc_type: { [Sequelize.Op.eq]: 'location' },
						qc_status: { [Sequelize.Op.eq]: true }
					}
				},
			]
		// }).then(result => JSON.parse(JSON.stringify(result)))
		}).then(result => {
			let jsonRow = JSON.parse(JSON.stringify(result))

			let mappedRow = {
				...jsonRow,
				location_desc: jsonRow?.qc_loc_user_activity ? jsonRow.qc_loc_user_activity.qc_description : null,
				service_name: jsonRow?.srv_user_activity ? jsonRow.srv_user_activity.service_name : null
			}

			return mappedRow
		})
	}
	catch(e) {
		throw e
	}
}

exports.getAvailableAgents = async() => {
	try {
		return await sequelize.query(`
			WITH RankedUserActivity AS (
				SELECT
					a.*,
					DENSE_RANK() OVER (PARTITION BY a.user_id ORDER BY a.start_datetime DESC) AS class_rank
				FROM user_activity_log a
				WHERE 1=1
			)

			SELECT
				x.*
			FROM
				RankedUserActivity x

			WHERE
				class_rank = 1
				AND x.user_status = 'Available'
				AND x.user_id NOT IN (
					
				SELECT y.ticket_support FROM doc_ticket_transaction_log y
					WHERE y.ticket_status IN (70, 50)
				)`,
		{
			type: sequelize.QueryTypes.SELECT,
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.updateUserLog = async({
	filters,
	data,
}) => {
	try {
		return await models.user_activity_log.update(
			{
				...data
			},
			{
				where:{
					...filters
				}
			}
		).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

const formatFilters = ({ model, filters }) => {
	try {
		let formattedFilters = {};

		if(filters.searchTerm && filters.searchTerm !== "") {
			let headers = Object.keys(model).filter(
				(h) => !["createdAt", "updatedAt"].includes(h)
			);

			// Properly format Op.or conditions
			formattedFilters = {
				[Sequelize.Op.or]: headers.map((field) => ({
					[field]: { [Sequelize.Op.like]: `%${filters.searchTerm}%` },
				})),
			};
		} else {
			delete filters.searchTerm;
			formattedFilters = filters;
		}

		return formattedFilters;
	} catch (e) {
		throw e;
	}
}

exports.getPaginatedUserActivity = async({
	filters,
	orderBy,
	pageIndex,
	pageSize
}) => {
	try {
		let newFilter = formatFilters({
			model : models.user_activity_log.rawAttributes,
			filters
		});

		const { count, rows } = await models.user_activity_log.findAndCountAll({
			where:{
				...newFilter
			}
			,offset	: parseInt(pageIndex) * parseInt(pageSize)
			,limit	: parseInt(pageSize)
			,order	: [orderBy] 
			,include: [
				{
					model: models.bas_service,
					foreignKey: 'service_id',
					as: 'srv_user_activity'
				},
			]
		}).then(result => {
			let { count, rows } = JSON.parse(JSON.stringify(result))

			return {
				rows,
				count
			}
		})

		return {
			count,
			rows
		}
	}
	catch (error) {
		throw error
	}
}