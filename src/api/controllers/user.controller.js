"use strict";

const { userService } = require('../../services/administration');
const { generateTempPassword, sendEmailTempPassword } = require('../../utils/helpers/helper');

exports.createUser = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;

		data.password = await generateTempPassword();

		await userService.createUser({
			...data,
			createdBy: processor?.user_id ?? data?.createdBy
		})

		await sendEmailTempPassword({
			email_address : data.user_email,
			tempPassword : data.password
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "User created successfully and email has been sent."
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.updateUser = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;

		await userService.updateUser({
			'filters': { user_id: data?.user_id },
			'data': {
				...data,
				createdBy: processor?.user_id ?? data.createdBy
			}
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "User updated successfully."
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.getPaginatedUser = async(req, res, next) => {
	try {
		const filters = req.query;

		let { rows, count } = await userService.getPaginatedUser({ filters })

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
