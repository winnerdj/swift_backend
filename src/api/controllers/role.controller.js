"use strict";

const router = require('express').Router();
const { roleService } = require('../../services/administration');

exports.createRole = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;

		await roleService.createRole({
			...data,
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
		const data = req.body;
		const processor = req.processor;

		const role_id = data?.role_name.toLowerCase().replace(/\s+/g, '_')

		await roleService.updateRole({
			'filters': { role_id },
			'data': {
				...data,
				updatedBy: processor?.user_id ?? data.updatedBy
			}
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "Role updated successfully."
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

exports.getPaginatedRole = async(req, res, next) => {
	try {
		const filters = req.query;

		let { rows, count } = await roleService.getPaginatedRole({ filters })

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
