"use strict";

const router = require('express').Router();
const moment = require('moment');
const Redis = require('redis');

const { serviceService } = require('../../services/data-management');
const { userActivityService, ticketService } = require('../../services/transactions');

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
		let filteredArray = []
		for(let counter = 1; counter <= service?.no_of_counters; counter++) {
			counters.push({
				value: counter,
				label: `${service.counter_prefix}-${counter}`
			});
		}

		/** Get Active counters */
		if(!redisClient.isOpen) {
			await redisClient.connect()
		}

		let redisResponse = await redisClient.json.get(`swift:counter:${filters.service_id}`)

		if(redisResponse) {
			let activeCounters = JSON.parse(redisResponse)

			/**Remove active counter */
			filteredArray = counters.filter(mainItem => {
				return !activeCounters.some(activeCounter => activeCounter.counter_no === mainItem.value);
			});
		}
		else {
			filteredArray = counters;
		}

		if(filteredArray.length === 0) throw new Error('No available counters to select')

		res.status(200).json({
			data: filteredArray
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
		let datetimeNow = moment().format('YYYY-MM-DD HH:mm:ss');

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

		let foo = {
			counter_no: data.counter_no,
			user_id: processor.user_id,
			dateTime: datetimeNow
		}

		let redisResponse = await redisClient.json.get(`swift:counter:${data.service_id}`)

		let arrayCounter = [];
		let redisValue;

		if(redisResponse) {
			arrayCounter = JSON.parse(redisResponse)
			arrayCounter.push(foo)
			redisValue = JSON.stringify(arrayCounter);

			await redisClient.json.set(`swift:counter:${data.service_id}`,'.', redisValue)
		}
		else {
			arrayCounter.push(foo)
			redisValue = JSON.stringify(arrayCounter);

			await redisClient.json.set(`swift:counter:${data.service_id}`,'.', redisValue)
		}

		/**Save work login in DB */
		let createdUserActivity = await userActivityService.createUserLog({
			user_id				: processor.user_id,
			activity			: 'Queue Login',
			location			: resultService.service_location,
			service_id			: resultService.service_id,
			counter				: data.counter_no,
			user_status			: 'Available',
			reason_code			: null,
			start_datetime		: datetimeNow,
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
		const processor = req.processor

		/** Get Service details */
		const result = await userActivityService.getLatestActivityByUser({
			user_id : processor.user_id
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

exports.getLatestActiveAssignedTicketByUser = async (req, res) => {
	try {
		const processor = req.processor

		/** Get Service details */
		const result = await ticketService.getLatestActiveAssignedTicketByUser({
			user_id : processor.user_id
		})

		res.status(200).json({
			data: result[0]
		})
	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: `${e}`
		})
	}
}

exports.workLogout = async(req, res, next) => {
	try {
		// let data = req.body;
		let processor = req.processor;
		let datetimeNow = moment().format('YYYY-MM-DD HH:mm:ss')

		/** Get latest user activity */
		let latestUserActivityResult = await userActivityService.getLatestActivityByUser({
			user_id : processor.user_id
		})

		/** Throw error if user is assigned */
		if(!latestUserActivityResult.user_status === 'Available') {
			throw new Error('User activity is not allowed to logout.')
		}

		/** Get latest ticket for the user */
		let ticketResult = await ticketService.getLatestActiveAssignedTicketByUser({
			user_id : processor.user_id
		})

		/** Throw error if user is assigned to a ticket */
		if(ticketResult?.ticket_status != 90 && ticketResult != null) {
			throw new Error(`User has active ticket. Ticket: ${ticketResult?.ticket_id}` )
		}

		/** Get Active/assigned counter for the user*/
		if(!redisClient.isOpen) {
			await redisClient.connect()
		}

		let redisResponse = await redisClient.json.get(`swift:counter:${latestUserActivityResult.service_id}`)

		if(redisResponse) {
			let activeCounters = JSON.parse(redisResponse)

			/** Release assigned counter */
			let filteredArray = activeCounters.filter(mainItem => {
				return !activeCounters.some(activeCounter => activeCounter.dani  === mainItem.value);
			});
			let redisValue = JSON.stringify(filteredArray)

			await redisClient.json.set(`swift:counter:${latestUserActivityResult.service_id}`, '.', redisValue)
		}

		/**Save work login in DB */
		let createdUserActivity = await userActivityService.createUserLog({
			user_id				: processor.user_id,
			activity			: 'Queue Logout',
			location			: latestUserActivityResult.location,
			service_id			: null,
			counter				: null,
			user_status			: 'Logout',
			reason_code			: null,
			start_datetime		: datetimeNow,
			duration			: moment.duration(moment(datetimeNow).diff(moment(latestUserActivityResult.start_datetime))).asSeconds(),
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "Work Logout successfully.",
			data: createdUserActivity
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.workBreaktime = async(req, res, next) => {
	try {
		let processor = req.processor;
		let datetimeNow = moment().format('YYYY-MM-DD HH:mm:ss')

		/** Get latest user activity */
		let latestUserActivityResult = await userActivityService.getLatestActivityByUser({
			user_id : processor.user_id
		})

		/** Throw error if user is assigned */
		if(!latestUserActivityResult.user_status === 'Available') {
			throw new Error('User activity is not allowed to logout.')
		}

		/** Get latest ticket for the user */
		let ticketResult = await ticketService.getLatestActiveAssignedTicketByUser({
			user_id : processor.user_id
		})

		/** Throw error if user is assigned to a ticket */
		if(ticketResult.length > 0) {
			throw new Error(`User has active ticket. Ticket: ${ticketResult?.ticket_id}` )
		}

		/**Save work login in DB */
		let createdUserActivity = await userActivityService.createUserLog({
			user_id				: processor.user_id,
			activity			: 'Queue Breaktime',
			location			: latestUserActivityResult.location,
			service_id			: null,
			counter				: null,
			user_status			: 'Breaktime',
			reason_code			: null,
			start_datetime		: datetimeNow,
			duration			: moment.duration(moment(datetimeNow).diff(moment(latestUserActivityResult.start_datetime))).asSeconds(),
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "Work breaktime successfully.",
			data: createdUserActivity
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.getTodayTicketsByService = async (req, res) => {
	try {
		const filters = req.query

		/** Get Service details */
		const result = await ticketService.getTodayTicketsByService({
			ticket_service : filters.service_id
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

exports.updateTicket = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;

		/** Set filters */
		let filters = {
			ticket_id : data.ticket_id
		}

		/** Set updateData */
		let updateTicketData = {
			...data,
			ticket_support	: processor.user_id
		}

		let updatedTicket = await ticketService.updateTicketData({
			updateTicketData,
			filters
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "Updated ticket successfully.",
			data: updatedTicket
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}
