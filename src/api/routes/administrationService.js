"use strict";

const router = require('express').Router();
const { createService, updateService, getPaginatedService } = require('../controllers/service.controller');
const { validateCreateServiceSchema, validateUpdateServiceSchema } = require('../schema/service.schema');

router.get('/', getPaginatedService);
router.post('/', validateCreateServiceSchema, createService);
router.put('/', validateUpdateServiceSchema, updateService);

module.exports = router;