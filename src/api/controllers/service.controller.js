"use strict";

const router = require('express').Router();
const { serviceService } = require('../../services/administration');

exports.createService = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;

		await serviceService.createService({
			...data,
			createdBy: processor?.user_id ?? data?.createdBy
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "Service created successfully."
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.updateService = async(req, res, next) => {
	try {
		const data = req.body;

		const processor = req.processor;

		const service_id = data?.service_id;

		let numOfUpdatedLines = await serviceService.updateService({
			'filters': { service_id },
			'data': {
				...data,
				updatedBy: processor?.user_id ?? data.updatedBy
			}
		})

		if(numOfUpdatedLines[0] !== 1) throw new Error(`No Service has been updated.`);

		res.status(200).json({
			success: true,
			code: '000',
			message: "Service updated successfully."
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.getPaginatedService = async(req, res, next) => {
	try {
		const filters = req.query;

		let { rows, count } = await serviceService.getPaginatedService({ filters })

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
