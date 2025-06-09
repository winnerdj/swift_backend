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

exports.getService = async({
	filters
}) => {
	try {
		return await dataLayer.getService({ filters })
	}
	catch(e) {
		throw e
	}
}

exports.getServiceById = async({
	service_id
}) => {
	try {
		return await dataLayer.getServiceById({ service_id })
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

exports.getAllServiceByLocation = async({
	filters
}) => {
	try {
		return await dataLayer.getAllServiceByLocation({
			filters
		})
	}
	catch(e) {
		throw e
	}
}

exports.getDropdownService = async({
	filters
}) => {
	try {
		return await dataLayer.getDropdownService({
			filters
		})
	}
	catch(e) {
		throw e
	}
}
