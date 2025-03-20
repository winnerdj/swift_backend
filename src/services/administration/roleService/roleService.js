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
		let { orderBy, page, totalPage, ...newFilters } = filters

		return await dataLayer.getPaginatedRole({
			orderBy:orderBy.split(','),
			page,
			totalPage,
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
		const user_password = data.user_new_password ? bcrypt.hashSync(data.user_new_password, 10) : undefined;

		return await dataLayer.updateRole({
			filters,
			'data' : {
				...data,
				user_password
			}
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
