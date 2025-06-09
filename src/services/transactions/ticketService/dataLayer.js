"use strict";

const models = require('../../../models/swift');
const { sequelize, Sequelize } = models;

const podModels = require('../../../models/pod');
const { where } = require('sequelize');
const { sequelize: podsequelize, Sequelize: podSequelize } = podModels;

exports.getTicket = async({
	filters
}) => {
	try {
		return await models.doc_ticket_transaction_log.findOne({
			where:{
				...filters
			}
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.getLatestTicketByService = async({
	filters
}) => {
	try {
		return await models.doc_ticket_transaction_log.findOne({
			where:{
				...filters
			},
			order: [
				['createdAt', 'DESC']
			]
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.updateTicket = async({
	filters,
	data,
	options
}) => {
	try {
		return await models.doc_ticket_transaction_log.update(
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

exports.getTripDetails = async({
	filters
}) => {
	try {
		return await podsequelize.query(`
			SELECT
				a.*
			FROM trip_plan_hdr_tbl a
			WHERE 1=1
			AND a.tripPlanNo = :tripPlanNo`,
		{
			replacements: {
				tripPlanNo: filters?.tripPlanNo
			},
			type: podSequelize.QueryTypes.SELECT,
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.createTicket = async({
	...data
}) => {
	try {
		return await models.doc_ticket_transaction_log.create({
			...data
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.getAllTicketByLocation = async({
	filters
}) => {
	try {
		return await sequelize.query(`
			CALL sp_getAllTicketByLocation(:serviceLocation)`,
		{
			replacements: {
				serviceLocation: filters?.serviceLocation
			},
			type: Sequelize.QueryTypes.SELECT,
		})
		.then(result => Object.values(JSON.parse(JSON.stringify(result[0]))))
	}
	catch (error) {
		throw error
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

exports.getPaginatedTicket = async({
	filters,
	orderBy,
	pageIndex,
	pageSize
}) => {
	try {
		let newFilter = formatFilters({
			model : models.doc_ticket_transaction_log.rawAttributes,
			filters
		});

		const { count, rows } = await models.doc_ticket_transaction_log.findAndCountAll({
			where:{
				...newFilter
			}
			,offset	: parseInt(pageIndex) * parseInt(pageSize)
			,limit	: parseInt(pageSize)
			,order	: [orderBy] 
			,include: [
				{
					model: models.bas_quick_code,
					foreignKey: 'ticket_status',
					as: 'qc_ticket_status',
					where: {
						qc_type: { [Sequelize.Op.eq]: 'ticket_status' },
						qc_status: { [Sequelize.Op.eq]: true },
					}
				},
				{
					model: models.bas_service,
					foreignKey: 'ticket_service',
					as: 'srv_ticket_service'
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
