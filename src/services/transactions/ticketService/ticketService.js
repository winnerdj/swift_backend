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
