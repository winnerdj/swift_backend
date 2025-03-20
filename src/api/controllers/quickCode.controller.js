"use strict";

const router = require('express').Router();
const { quickCodeService } = require('../../services/administration');

exports.createQuickCode = async(req, res, next) => {
	try {
		const { data } = req.body;
		const processor = req.processor;

		if(!data || data.length < 0) throw new Error('No quickcodes found.')

		let dataToInsert = data.map(foo => {
			return {
				...foo,
				createdBy: foo?.createdBy ?? processor?.user_id
			}
		})

		await quickCodeService.bulkCreateQuickCode({
			dataToInsert
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "Quick Code/s created successfully."
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}
