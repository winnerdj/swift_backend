"use strict";

const router = require('express').Router();
const { quickcodeService } = require('../../services/administration');

exports.createQuickcode = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;

		await quickcodeService.createQuickcode({
			...data,
			createdBy: processor?.user_id ?? data?.createdBy
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "Quick Code created successfully."
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.updateQuickcode = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;

		/** Convert qc_type and qc_code to qc_id */
		const qc_id = data?.qc_type.toLowerCase().trim().replace(/\s+/g, '_').concat('@',data?.qc_code.toLowerCase().trim().replace(/\s+/g, '_'));

		await quickcodeService.updateQuickcode({
			'filters': { qc_id },
			'data': {
				...data,
				updatedBy: processor?.user_id ?? data.updatedBy
			}
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "Quickcode updated successfully."
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.getPaginatedQuickcode = async(req, res, next) => {
	try {
		const filters = req.query;

		let { rows, count } = await quickcodeService.getPaginatedQuickcode({ filters })

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