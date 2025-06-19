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
