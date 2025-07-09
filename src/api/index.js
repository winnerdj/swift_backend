"use strict";

const router = require('express').Router();

const validateUserToken = require("../middleware/validateUserToken");

/**Administration*/
router.use('/auth',											require('./routes/authentication.route'));
router.use('/user',				/**validateUserToken,*/		require('./routes/user.route'));
router.use('/role',				validateUserToken,			require('./routes/role.route'));
router.use('/quickcode',		validateUserToken,			require('./routes/quickcode.route'));
router.use('/service',			validateUserToken,			require('./routes/service.route'));
router.use('/user-activity',	validateUserToken,			require('./routes/userActivity.route'));

router.use('/select',			validateUserToken,			require('./routes/select.route'));

router.use('/ticket',			/*validateUserToken,*/		require('./routes/ticket.route'));

router.use('/work',				validateUserToken,			require('./routes/work.route'));


module.exports = router;