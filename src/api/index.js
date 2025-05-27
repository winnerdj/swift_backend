"use strict";

const router = require('express').Router();

const validateUserToken = require("../middleware/validateUserToken");

/**Administration*/
router.use('/auth',									require('./routes/authentication'));
router.use('/user',			/**validateUserToken,*/	require('./routes/administrationUser'));
router.use('/role',			validateUserToken,	require('./routes/administrationRole'));
router.use('/quickcode',	validateUserToken,	require('./routes/administrationQuickcode'));
router.use('/service',		validateUserToken,	require('./routes/administrationService'));

router.use('/select',	/*validateUserToken,*/	require('./routes/select'));

router.use('/ticket',	/*validateUserToken,*/	require('./routes/ticket'));



module.exports = router;