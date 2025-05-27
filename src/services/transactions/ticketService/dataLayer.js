"use strict";

const models = require('../../../models/swift');
const { sequelize, Sequelize } = models;

const podModels = require('../../../models/pod');
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
