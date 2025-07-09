"use strict";

const { userActivityService } = require('../../services/transactions');

exports.getPaginatedUserActivity = async(req, res, next) => {
	try {
		const filters = req.query;

		let { rows, count } = await userActivityService.getPaginatedUserActivity({ filters })

		let pageCount = Math.ceil(count / filters.pageSize)

		res.status(200).json({
			rows, count, pageCount
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}
