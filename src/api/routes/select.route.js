"use strict";

const router = require('express').Router();
const { roleService  } = require('../../services/administration');
const { quickcodeService, serviceService } = require('../../services/data-management');
const { userActivityService } = require('../../services/transactions');

router.get('/role', async (req, res) => {
	try {
		const data = await roleService.getDropdownRole({
			filters: {
				role_status: '1'
			}
		})

		res.status(200).json({
			data: data.map(item => {
				return {
					label: item.role_name,
					value: item.role_id
				}
			})
		})

	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: `${e}`
		})
	}
})

router.get('/quickcode', async (req, res) => {
	try {
		const filters = req.query

		const data = await quickcodeService.getDropdownQuickcode({
			filters: {
				qc_status: true,
				...filters
			}
		})

		res.status(200).json({
			data: data.map(item => {
				return {
					value: item.qc_id,
					label: `${item.qc_code} : ${item.qc_description}`
				}
			})
		})

	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: `${e}`
		})
	}
})

router.get('/service', async (req, res) => {
	try {
		const filters = req.query

		const { rows, count } = await serviceService.getDropdownService({
			filters: {
				service_status: true,
				...filters
			}
		})

		res.status(200).json({
			data: rows.map(item => {
				return {
					value: item.service_id,
					label: `${item.service_name} : ${item.qc_service_location_desc}`
				}
			})
		})

	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: `${e}`
		})
	}
})

router.get('/transfer-service', async (req, res) => {
	try {
		const filters = req.query
		const processor = req.processor

		/** Get latest user activity */
		let latestUserActivityResult = await userActivityService.getLatestActivityByUser({
			user_id : processor.user_id
		})

		const { rows, count } = await serviceService.getDropdownService({
			filters: {
				service_status		: true,
				service_location	: latestUserActivityResult?.srv_user_activity?.service_location,
				...filters
			}
		}).then(async (result) => {
			/** Filter out the service that is currently being served */
			return {
				rows: result.rows.filter(service => service.service_id !== latestUserActivityResult.service_id),
				count: result.count
			}
		})

		res.status(200).json({
			data: rows.map(item => {
				return {
					value: item.service_id,
					label: `${item.service_name} : ${item.service_description}`
				}
			})
		})
	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: `${e}`
		})
	}
})

module.exports = router;