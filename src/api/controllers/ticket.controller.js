"use strict";

const router = require('express').Router();
const moment = require('moment');
const { ticketService } = require('../../services/transactions');
const { serviceService } = require('../../services/data-management');

exports.createTicket = async(req, res, next) => {
	try {
		const data = req.body;
		const processor = req.processor;

		/** Get the service data for the ticket details */
		let filterService = {
			service_id : data.ticket_service
		}

		let resultService = await serviceService.getService({ filters : filterService })

		/** Get latest ticket to increment the ticket_id */
		let filterTicket = {
			ticket_service : data.ticket_service
		}

		let latestTicket = await ticketService.getLatestTicketByService({ filters : filterTicket })

		let datetimeNow = moment().format('YYYY-MM-DD HH:mm:ss');
		let ticketDataForCreation = {
			ticket_id						: null,
			ticket_service					: data.ticket_service,
			ticket_status					: 10,
			ticket_level					: data.ticket_level,
			ticket_parent_reference			: null,
			ticket_head_reference			: null,
			ticket_counter					: null,
			ticket_support					: null,
			ticket_create_datetime			: datetimeNow,
			ticket_queue_datetime			: datetimeNow,
			ticket_assigned_datetime		: null,
			ticket_now_serving_datetime		: null,
			ticket_served_datetime			: null,
			ticket_no_show_datetime			: null,
			ticket_cancelled_datetime		: null,
			ticket_reason_code				: null,
			ticket_trip_number				: data?.ticket_trip_number,
			ticket_trucker_id				: data?.ticket_trucker_id,
			ticket_trucker_name				: data?.ticket_trucker_name,
			ticket_vehicle_type				: data?.ticket_vehicle_type,
			ticket_plate_num				: data.ticket_plate_num,
			ticket_remarks1					: data.ticket_remarks1,
			ticket_remarks2					: data.ticket_remarks2,
			ticket_remarks3					: data.ticket_remarks3,
			createdBy						: processor?.user_id ?? data?.createdBy
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
			message: "Ticket created successfully.",
			data: createdTicket
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.getTripDetails = async(req, res, next) => {
	try {
		const filters = req.query;

		let result = await ticketService.getTripDetails({ filters })

		res.status(200).json({
			success: true,
			code: '000',
			message: "Trip fetched successfully.",
			data: result
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.getQueueDisplayDetailByLocation = async(req, res, next) => {
	try {
		const filters = req.query;

		let tickets = await ticketService.getAllTicketByLocation({ filters });
		// let counters = await ticketService.getCountersByLocation({ filters });

		res.status(200).json({
			tickets,
			counters : [ { key: 'value' } ],
		})
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.getPaginatedTicket = async(req, res, next) => {
	try {
		const filters = req.query;

		let { rows, count } = await ticketService.getPaginatedTicket({ filters })

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
