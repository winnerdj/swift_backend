"use strict";

const router = require('express').Router();
const moment = require('moment');
const Redis = require('redis');

const { serviceService } = require('../../services/data-management');
const { userActivityService } = require('../../services/transactions');

const { redisConfig } = require('../../config/config');
const redisClient = Redis.createClient({
	...redisConfig
})

exports.getAvailableCounter = async (req, res) => {
	try {
		const filters = req.query

		/** Get Service details */
		const service = await serviceService.getServiceById({
			service_id : filters.service_id
		})

		/** Generate counters base from the service result */
		let counters = []
		for (let counter = 1; counter <= service?.no_of_counters; counter++) {
			counters.push({
				value: counter,
				label: `${service.counter_prefix}-${counter}`
			});
		}

		/** Get Active counters */

		/**Remove active counter */

		res.status(200).json({
			data: counters
		})
	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: `${e}`
		})
	}
}

exports.workLogin = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;

		/** Get the service data for the ticket details */
		let filterService = {
			service_id : data.service_id,
			service_status : 1
		}

		let resultService = await serviceService.getService({ filters : filterService })

		if(!resultService) throw new Error('Service not found or inactive.');

		/**Set counter to active */
		if(!redisClient.isOpen) {
			await redisClient.connect()
		}

		await redisClient.json.set(`swift:counter:${data.service_id}`,'.', data.counter_no)

		/**Save work login in DB */
		let createdUserActivity = await userActivityService.createUserLog({
			user_id				: processor.user_id,
			activity			: 'Queue Login',
			location			: resultService.service_location,
			service_id			: resultService.service_id,
			counter				: data.counter_no,
			user_status			: 'Available',
			reason_code			: null,
			start_datetime		: moment().format('YYYY-MM-DD HH:mm'),
			duration			: 0,
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "Work Login successfully.",
			data: createdUserActivity
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.getLatestActivityByUser = async (req, res) => {
	try {
		const filters = req.query

		/** Get Service details */
		const result = await userActivityService.getLatestActivityByUser({
			service_id : filters.service_id
		})

		res.status(200).json({
			data: result
		})
	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: `${e}`
		})
	}
}