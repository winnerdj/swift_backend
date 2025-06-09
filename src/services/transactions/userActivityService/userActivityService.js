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
	filters
}) => {
	try {
		return await dataLayer.getLatestActivityByUser({
			filters
		})
	}
	catch(e) {
		throw e
	}
}
