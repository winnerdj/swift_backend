"use strict";

const {
	getAvailableCounter,
	workLogin,
	workLogout,
	workBreaktime,
	getLatestActivityByUser,
	getLatestActiveAssignedTicketByUser,
	getTodayTicketsByService,
	updateTicket
} = require('../controllers/work.controller');

const router = require('express').Router();

router.get('/available-counter',				getAvailableCounter);

router.post('/login',							workLogin);

router.get('/latest-user-activity',				getLatestActivityByUser);

router.post('/logout',							workLogout);
router.post('/breaktime',						workBreaktime);

router.get('/active-assigned-ticket',			getLatestActiveAssignedTicketByUser);

router.get('/all-tickets-today-by-service',		getTodayTicketsByService);

router.post('/start-serving',					updateTicket);
router.post('/end-serving',						updateTicket);
router.post('/no-show',							updateTicket);

module.exports = router;