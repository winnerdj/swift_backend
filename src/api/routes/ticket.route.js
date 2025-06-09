"use strict";

const router = require('express').Router();
const { createTicket,
	// updateTicket,
	getPaginatedTicket,
	getQueueDisplayDetailByLocation,
	getTripDetails } = require('../controllers/ticket.controller');
const { validateCreateTicketSchema, validateUpdateTicketSchema } = require('../schema/ticket.schema');


router.get('/', getPaginatedTicket);
router.post('/', validateCreateTicketSchema, createTicket);
// router.put('/', validateUpdateTicketSchema, updateTicket);

router.get('/queue-display', getQueueDisplayDetailByLocation);
router.get('/trip-no', getTripDetails);

module.exports = router;