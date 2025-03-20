"use strict";

const bcrypt = require('bcryptjs');
const dataLayer = require('./dataLayer');

exports.bulkCreateDataMap = async({
	dataToInsert
}) => {
	try {
		return await dataLayer.bulkCreateDataMap({
			dataToInsert
		})
	}
	catch(e) {
		throw e
	}
}

exports.getMappingData = async({
	filters
}) => {
	try {
		return await dataLayer.getMappingData({
			filters
		})
	}
	catch(e) {
		throw e
	}
}
