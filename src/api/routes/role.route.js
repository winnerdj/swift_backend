"use strict";

const router = require('express').Router();
const { createRole, updateRole, getPaginatedRole } = require('../controllers/role.controller');
const { validateCreateRoleSchema, validateUpdateRoleSchema } = require('../schema/role.schema');

router.get('/', getPaginatedRole);
router.post('/', validateCreateRoleSchema, createRole);
router.put('/', validateUpdateRoleSchema, updateRole);

module.exports = router;