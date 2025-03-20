"use strict";

const router = require('express').Router();
const { createUser, updateUser, getPaginatedUser } = require('../controllers/user.controller');
const { validateCreateUserSchema, validateUpdateUserSchema }  = require('../schema/user.schema');

router.get('/', getPaginatedUser);
router.post('/', validateCreateUserSchema, createUser);
router.put('/', validateUpdateUserSchema, updateUser);

module.exports = router;