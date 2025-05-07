"use strict";

const dataLayer = require('./dataLayer');

exports.createService = async({
	...data
}) => {
	try {
		return await dataLayer.createService({
			...data
		})
	}
	catch(e) {
		throw e
	}
}

exports.getPaginatedService = async({
	filters
}) => {
	try {
		let { order, pageIndex, pageSize, ...newFilters } = filters;

		order = order ? order : 'updatedAt,DESC';

		return await dataLayer.getPaginatedService({
			orderBy:order.split(','),
			pageIndex,
			pageSize,
			filters:{
				...newFilters
			}
		})
	}
	catch(e) {
		throw e
	}
}

exports.updateService = async({
	filters,
	data
}) => {
	try {
		return await dataLayer.updateService({
			filters,
			data
		})
	}
	catch(e) {
		throw e
	}
}
