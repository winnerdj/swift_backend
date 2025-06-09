"use strict";

const dataLayer = require('./dataLayer');

exports.createTicket = async({
	...data
}) => {
	try {
		return await dataLayer.createTicket({
			...data
		})
	}
	catch(e) {
		throw e
	}
}

exports.getTripDetails = async({
	filters
}) => {
	try {
		return await dataLayer.getTripDetails({
			filters
		})
	}
	catch(e) {
		throw e
	}
}

exports.getLatestTicketByService = async({
	filters
}) => {
	try {
		return await dataLayer.getLatestTicketByService({
			filters
		})
	}
	catch(e) {
		throw e
	}
}

exports.getAllTicketByLocation = async({
	filters
}) => {
	try {
		return await dataLayer.getAllTicketByLocation({
			filters
		})
	}
	catch(e) {
		throw e
	}
}

exports.getPaginatedTicket = async({
	filters
}) => {
	try {
		let { order, pageIndex, pageSize, ...newFilters } = filters;

		order = order ? order : 'updatedAt,DESC';

		return await dataLayer.getPaginatedTicket({
			orderBy : order.split(','),
			pageIndex,
			pageSize,
			filters : {
				...newFilters
			}
		})
	}
	catch(e) {
		throw e
	}
}
