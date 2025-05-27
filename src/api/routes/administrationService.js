"use strict";

const router = require('express').Router();
const { createService, updateService, getPaginatedService, getAllServiceByLocation } = require('../controllers/service.controller');
const { validateCreateServiceSchema, validateUpdateServiceSchema } = require('../schema/service.schema');

router.get('/', getPaginatedService);
router.post('/', validateCreateServiceSchema, createService);
router.put('/', validateUpdateServiceSchema, updateService);

router.get('/location', getAllServiceByLocation);

module.exports = router;