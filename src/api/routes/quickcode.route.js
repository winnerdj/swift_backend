"use strict";

const router = require('express').Router();
const { createQuickcode, updateQuickcode, getPaginatedQuickcode } = require('../controllers/quickcode.controller');
const { validateCreateQuickcodeSchema, validateUpdateQuickcodeSchema } = require('../schema/quickcode.schema');

router.get('/', getPaginatedQuickcode);
router.post('/', validateCreateQuickcodeSchema, createQuickcode);
router.put('/', validateUpdateQuickcodeSchema, updateQuickcode);

module.exports = router;