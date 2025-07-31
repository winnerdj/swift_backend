"use strict";

const {
	getAvailableCounter,
	workLogin,
	workLogout,
	workBreaktime,
	getLatestActivityByUser,
	getLatestActiveAssignedTicketByUser,
	getTodayTicketsByService,
	getTodayActiveCountersByService,
	getTodayUserActivityByService,
	updateTicket,
	overrideTicket,
	cancelTicket,
	transferTicket
} = require('../controllers/work.controller');

const router = require('express').Router();

router.get('/available-counter',						getAvailableCounter);
router.get('/latest-user-activity',						getLatestActivityByUser);

router.post('/login',									workLogin);
router.post('/logout',									workLogout);
router.post('/breaktime',								workBreaktime);

router.get('/active-assigned-ticket',					getLatestActiveAssignedTicketByUser);
router.get('/all-tickets-today-by-service',				getTodayTicketsByService);
router.get('/all-active-counters-today-by-service',		getTodayActiveCountersByService);
router.get('/all-user-activity-today-by-service',		getTodayUserActivityByService);

router.post('/start-serving',							updateTicket);
router.post('/end-serving',								updateTicket);
router.post('/no-show',									updateTicket);

router.post('/override-ticket',							overrideTicket);
router.post('/cancel-ticket',							cancelTicket);
router.post('/transfer-ticket',							transferTicket);

module.exports = router;