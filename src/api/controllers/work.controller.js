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

		/** Get latest ticket for the user */
		let ticketResult = await ticketService.getLatestActiveAssignedTicketByUser({
			user_id : processor.user_id
		})

		/** Throw error if user is assigned to a ticket */
		if(ticketResult.length > 0) {
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

		/**Update the duration of Queue activity in DB */
		await userActivityService.updateUserLog({
			filters: {
				log_id		: latestUserActivityResult.log_id,
				user_id		: processor.user_id,
			},
			data	: {
				duration	: moment.duration(moment(datetimeNow).diff(moment(latestUserActivityResult.start_datetime))).asSeconds(),
			}
		})

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
			duration			: 0,
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
		let userActivity;

		/** Get latest user activity */
		let latestUserActivityResult = await userActivityService.getLatestActivityByUser({
			user_id : processor.user_id
		})

		if(latestUserActivityResult.activity === 'Queue Breaktime' && latestUserActivityResult.user_status === 'Breaktime') {
			/**Update the duration of Queue Breaktime in DB */
			userActivity = await userActivityService.updateUserLog({
				filters: {
					log_id		: latestUserActivityResult.log_id,
					user_id		: processor.user_id,
				},
				data	: {
					duration	: moment.duration(moment(datetimeNow).diff(moment(latestUserActivityResult.start_datetime))).asSeconds(),
					user_status	: 'Available',
				}
			})
		}

		/** Get latest ticket for the user */
		let ticketResult = await ticketService.getLatestActiveAssignedTicketByUser({
			user_id : processor.user_id
		})

		/** Throw error if user is assigned to a ticket */
		if(ticketResult.length > 0) {
			throw new Error(`User has active ticket. Ticket: ${ticketResult?.ticket_id}` )
		}

		if(latestUserActivityResult.user_status === 'Available') {
			/**Save work Breaktime in DB */
			userActivity = await userActivityService.createUserLog({
				user_id				: processor.user_id,
				activity			: 'Queue Breaktime',
				location			: latestUserActivityResult.location,
				service_id			: latestUserActivityResult.service_id,
				counter				: latestUserActivityResult.counter,
				user_status			: 'Breaktime',
				reason_code			: null,
				start_datetime		: datetimeNow,
				duration			: 0,
			})
		}

		res.status(200).json({
			success: true,
			code: '000',
			message: "Work breaktime successfully.",
			data: userActivity
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

exports.getTodayActiveCountersByService = async (req, res) => {
	try {
		const filters = req.query

		/** Get Active counters */
		if(!redisClient.isOpen) {
			await redisClient.connect()
		}

		let redisResponse = await redisClient.json.get(`swift:counter:${filters.service_id}`)
		let activeCounters = [];
		if(redisResponse !== null || redisResponse) {
			activeCounters = JSON.parse(redisResponse)
		}

		res.status(200).json({
			data: activeCounters
		})
	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: `${e}`
		})
	}
}

exports.getTodayUserActivityByService = async (req, res) => {
	try {
		const filters = req.query

		/** Get Service details */
		const result = await ticketService.getTodayUserActivityByService({
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

exports.overrideTicket = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;

		/** Set filters */
		let filters = {
			ticket_id		: data.ticket_id
		}

		/** Set updateData */
		let updateTicketData = {
			...data,
			ticket_status	: data.ticket_status.split('@')[1], // No show status
			ticket_support	: processor.user_id,
			ticket_override	: 1
		}

		let ticketResult = await ticketService.getTicket({
			filters
		})

		/** Check if ticket is valid */
		if(!ticketResult) {
			throw new Error('Ticket not found.')
		}

		/** Check if ticket service is align with the work session */
		if(ticketResult.ticket_service !== data.ticket_service) {
			throw new Error('Ticket is not align with service session.')
		}

		/** Check if ticket has valid ticket_status */
		if(ticketResult.ticket_status !== 60) {
			throw new Error('Ticket is not in No show status.')
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

exports.cancelTicket = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;

		/** Set filters */
		let filters = {
			ticket_id		: data.ticket_id
		}

		/** Set updateData */
		let updateTicketData = {
			...data,
			ticket_status		: 90, // Cancelled status
			ticket_support		: processor.user_id,
		}

		let ticketResult = await ticketService.getTicket({
			filters
		})

		/** Check if ticket is valid */
		if(!ticketResult) {
			throw new Error('Ticket not found.')
		}

		/** Check if ticket has valid ticket_status */
		if(![50, 70].includes(ticketResult.ticket_status)) {
			throw new Error('Ticket is not in Assigned or Serving status.')
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

exports.transferTicket = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;
		let datetimeNow = moment().format('YYYY-MM-DD HH:mm:ss')

		/** Set filters */
		let filters = {
			ticket_id		: data.ticket_id
		}

		/** Set updateData */
		let updateTicketData = {
			ticket_status			: 100, // Served status,
			ticket_served_datetime	: datetimeNow
		}

		let ticketResult = await ticketService.getTicket({
			filters
		})

		/** Check if ticket is valid */
		if(!ticketResult) {
			throw new Error('Ticket not found.')
		}

		/** Check if ticket has valid ticket_status */
		if(![70].includes(ticketResult.ticket_status)) {
			throw new Error('Ticket is not in Serving status.')
		}

		await ticketService.updateTicketData({
			updateTicketData,
			filters
		})

		let resultService = await serviceService.getService({ filters : { service_id : data.ticket_service} })

		let latestTicket = await ticketService.getLatestTicketByService({ filters : { ticket_service: data.ticket_service } })

		let ticketDataForCreation = {
			ticket_id						: null,
			ticket_service					: data.ticket_service,
			ticket_status					: 10,
			ticket_level					: ticketResult.ticket_level+1, // Increment level by 1
			ticket_parent_reference			: data.ticket_id,
			ticket_head_reference			: ticketResult.ticket_head_reference ?? data.ticket_id,
			ticket_counter					: null,
			ticket_support					: null,
			ticket_create_datetime			: datetimeNow,
			ticket_queue_datetime			: ticketResult.ticket_queue_datetime,
			ticket_assigned_datetime		: null,
			ticket_now_serving_datetime		: null,
			ticket_served_datetime			: null,
			ticket_no_show_datetime			: null,
			ticket_cancelled_datetime		: null,
			ticket_reason_code				: null,
			ticket_trip_number				: ticketResult?.ticket_trip_number,
			ticket_trucker_id				: ticketResult?.ticket_trucker_id,
			ticket_trucker_name				: ticketResult?.ticket_trucker_name,
			ticket_vehicle_type				: ticketResult?.ticket_vehicle_type,
			ticket_plate_num				: ticketResult.ticket_plate_num,
			ticket_remarks1					: ticketResult.ticket_remarks1,
			ticket_remarks2					: ticketResult.ticket_remarks2,
			ticket_remarks3					: ticketResult.ticket_remarks3,
			createdBy						: processor?.user_id
		}

		/** Increment the ticket id */
		if(!latestTicket) {
			ticketDataForCreation.ticket_id = resultService?.counter_prefix + moment().format('-YYMMDD-') + '0001'
		}
		else {
			ticketDataForCreation.ticket_id = resultService?.counter_prefix + moment().format('-YYMMDD-') + (parseInt(latestTicket.ticket_id.split('-')[2]) + 1).toString().padStart(4, '0')
		}

		/** Create ticket */
		let createdTicket = await ticketService.createTicket({
			...ticketDataForCreation
		})

		res.status(200).json({
			success: true,
			code: '000',
			message: "Transfered ticket successfully.",
			data: createdTicket
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}
