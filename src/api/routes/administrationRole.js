"use strict";

const router = require('express').Router();
const { createRole, updateRole } = require('../controllers/role.controller');

router.post('/', createRole);
router.patch('/', updateRole);

module.exports = router;