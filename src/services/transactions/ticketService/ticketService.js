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

exports.getTicket = async({
	filters
}) => {
	try {
		return await dataLayer.getTicket({
			filters
		})
	}
	catch(e) {
		throw e
	}
}

exports.getLatestTicketByUser = async({
	...data
}) => {
	try {
		return await dataLayer.getLatestTicketByUser({
			...data
		})
	}
	catch(e) {
		throw e
	}
}

exports.getAllWaitingTickets = async({
	...data
}) => {
	try {
		return await dataLayer.getAllWaitingTickets({
			...data
		})
	}
	catch(e) {
		throw e
	}
}

exports.assignTicketToUser = async({
	updateTicketData,
	ticket_id
}) => {
	try {
		return await dataLayer.assignTicketToUser({
			updateTicketData,
			ticket_id
		})
	}
	catch(e) {
		throw e
	}
}

exports.getLatestActiveAssignedTicketByUser = async({
	user_id
}) => {
	try {
		return await dataLayer.getLatestActiveAssignedTicketByUser({
			user_id
		})
	}
	catch(e) {
		throw e
	}
}

exports.getTodayTicketsByService = async({
	ticket_service
}) => {
	try {
		return await dataLayer.getTodayTicketsByService({
			ticket_service
		})
	}
	catch(e) {
		throw e
	}
}

exports.getTodayUserActivityByService = async({
	service_id
}) => {
	try {
		return await dataLayer.getTodayUserActivityByService({
			service_id
		})
	}
	catch(e) {
		throw e
	}
}

exports.updateTicketData = async({
	updateTicketData,
	filters
}) => {
	try {
		return await dataLayer.updateTicket({
			data: updateTicketData,
			filters
		})
	}
	catch(e) {
		throw e
	}
}
