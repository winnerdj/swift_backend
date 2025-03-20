"use strict";

const router = require('express').Router();
const { serviceService } = require('../../services/administration');

exports.createService = async(req, res, next) => {
	try {
		const { data } = req.body;
		const processor = req.processor;

		await userService.createService({
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
		const { data } = req.body;
		const processor = req.processor;

		await userService.updateService({
			'filters': { user_id: data?.user_id },
			'data': {
				...data,
				UpdatedBy: processor?.user_id ?? data.createdBy
			}
		})

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
