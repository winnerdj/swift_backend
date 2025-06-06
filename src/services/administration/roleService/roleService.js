"use strict";

const bcrypt = require('bcryptjs');
const dataLayer = require('./dataLayer');

exports.createRole = async({
	...data
}) => {
	try {

		return await dataLayer.createRole({
			...data
		})
	}
	catch(e) {
		throw e
	}
}

exports.getPaginatedRole = async({
	filters
}) => {
	try {
		let { order, pageIndex, pageSize, ...newFilters } = filters;

		order = order ? order : 'updatedAt,DESC';

		return await dataLayer.getPaginatedRole({
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

/**LOGIN SERVICE */
exports.getRole = async({
	filters
}) => {
	try {
		return await dataLayer.getRole({
			filters
		})
	}
	catch(e) {
		throw e
	}
}

exports.getAllRole = async({
	filters
}) => {
	try {
		return await dataLayer.getAllRole({
			filters
		})
	}
	catch(e) {
		throw e
	}
}

exports.updateRole = async({
	filters,
	data
}) => {
	try {
		return await dataLayer.updateRole({
			filters,
			data
		})
	}
	catch(e) {
		throw e
	}
}

exports.getDropdownRole = async({
	filters
}) => {
	try {
		return await dataLayer.getDropdownRole({
			filters
		})
	}
	catch(e) {
		throw e
	}
}
