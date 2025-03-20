"use strict";

const router = require('express').Router();
const { createQuickCode } = require('../controllers/quickCode.controller');

router.post('/', createQuickCode);

module.exports = router;