"use strict";

const router = require('express').Router();
const { roleService } = require('../../services/administration');

exports.createRole = async(req, res, next) => {
	try {
		const { data } = req.body;
		const processor = req.processor;

		await roleService.createRole({
			...data,
			password: data?.user_password ?? 'kerrylogistikus',
			createdBy: processor?.user_id ?? data?.createdBy
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "Role created successfully."
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.updateRole = async(req, res, next) => {
	try {
		const { data } = req.body;
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

exports.getDropdownRole = async(req, res, next) => {
	try {
		const filters = req.query;

		let result = await roleService.getDropdownRole({ filters })

		res.status(200).json({ result })
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}
