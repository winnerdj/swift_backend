"use strict";

const bcrypt = require('bcryptjs');
const dataLayer = require('./dataLayer');

exports.bulkCreateQuickCode = async({
	dataToInsert
}) => {
	try {

		return await dataLayer.bulkCreateQuickCode({
			dataToInsert
		})
	}
	catch(e) {
		throw e
	}
}
