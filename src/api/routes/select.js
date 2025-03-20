"use strict";

const router = require('express').Router();
const { roleService } = require('../../services/administration');

router.get('/role', async (req, res) => {
	try {
		const data = await roleService.getDropdownRole({
			filters: {
				role_status: '1'
			}
		})

		res.status(200).json({
			data: data.map(item => {
				return {
					label: item.role_name,
					value: item.role_id
				}
			})
		})

	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: `${e}`
		})
	}
})

module.exports = router;