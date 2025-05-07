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

		const qc_id = data?.qc_id;

		let numOfUpdatedLines = await quickcodeService.updateQuickcode({
			'filters': { qc_id },
			'data': {
				...data,
				updatedBy: processor?.user_id ?? data.updatedBy
			}
		})

		if(numOfUpdatedLines[0] !== 1) throw new Error(`No Quickcode has been updated.`);

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
