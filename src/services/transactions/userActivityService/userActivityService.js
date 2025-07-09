"use strict";

// const { serviceService } = require('../../data-management');
const dataLayer = require('./dataLayer');

exports.createUserLog = async({
	...data
}) => {
	try {
		return await dataLayer.createUserLog({
			...data
		})
	}
	catch(e) {
		throw e
	}
}

exports.getLatestActivityByUser = async({
	user_id
}) => {
	try {
		return await dataLayer.getLatestActivityByUser({
			user_id
		})
	}
	catch(e) {
		throw e
	}
}

exports.getAvailableAgents = async() => {
	try {
		return await dataLayer.getAvailableAgents()
	}
	catch(e) {
		throw e
	}
}

exports.updateUserLog =async({
	filters,
	data
}) => {
	try {
		return await dataLayer.updateUserLog({
			filters,
			data
		})
	}
	catch(e) {
		throw e
	}
}

exports.getPaginatedUserActivity = async({
	filters
}) => {
	try {
		let { order, pageIndex, pageSize, ...newFilters } = filters;

		order = order ? order : 'updatedAt,DESC';

		return await dataLayer.getPaginatedUserActivity({
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
