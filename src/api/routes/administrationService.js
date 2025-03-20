"use strict";

const router = require('express').Router();
const { createService, updateService } = require('../controllers/service.controller');

router.post('/', createService);
router.patch('/', updateService);

module.exports = router;