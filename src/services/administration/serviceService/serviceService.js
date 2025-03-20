"use strict";

const bcrypt = require('bcryptjs');
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
		let { orderBy, page, totalPage, ...newFilters } = filters

		return await dataLayer.getPaginatedService({
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
exports.getService = async({
	filters
}) => {
	try {
		return await dataLayer.getService({
			filters
		})
	}
	catch(e) {
		throw e
	}
}

exports.getAllService = async({
	filters
}) => {
	try {
		return await dataLayer.getAllService({
			filters
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
		const user_password = data.user_new_password ? bcrypt.hashSync(data.user_new_password,10) : undefined;

		return await dataLayer.updateService({
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
