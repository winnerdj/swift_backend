"use strict";

const models = require('../../../models/swift');
const {sequelize, Sequelize} = models;

exports.createRole = async({
	...data
}) => {
	try {
		return await models.bas_role.create({
			...data
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

const formatFilters = ({
	model,
	filters
}) => {
	try {
		let formattedFilters;
		if(filters.search && filters.search !== '') {
			formattedFilters = {
				[Sequelize.Op.or]: [
					{
						role_email: {
							[Sequelize.Op.like]: `%${filters.search}%`
						}
					},
					{
						role_first_name: {
							[Sequelize.Op.like]: `%${filters.search}%`
						}
					},
					{
						role_last_name: {
							[Sequelize.Op.like]: `%${filters.search}%`
						}
					},
					{
						role_contact_no: {
							[Sequelize.Op.like]: `%${filters.search}%`
						}
					},
					{
						role_remarks1: {
							[Sequelize.Op.like]: `%${filters.search}%`
						}
					}
				]
			};
		}
		else {
			formattedFilters = filters;
			const attributes = Object.keys(model).filter(h => !['createdAt','updatedAt'].includes(h))
			Object.keys(filters).map(field => {
				if(field==='search'){
					let fields = {}
					attributes.map(item => (fields[item] = filters.search))
					formattedFilters={
						...formattedFilters,
						[Sequelize.Op.or]:fields
					}

					delete formattedFilters["search"]
				}
			})
		}

		return formattedFilters
	}
	catch(e) {
		throw e
	}
}

exports.getPaginatedRole = async({
	filters,
	orderBy,
	page,
	totalPage
}) => {
	try {
		let newFilter = formatFilters({
			model:models.role_tbl.rawAttributes,
			filters
		});

		const {count,rows} = await models.role_tbl.findAndCountAll({
			where:{
				...newFilter
			},
			offset	:parseInt(page) * parseInt(totalPage),
			limit	:parseInt(totalPage),
			include:[
				{
					model:models.role_hdr_tbl,
					attributes:['role_name'],
					as:'role'
				},
				{
					model:models.reason_code_tbl,
					attributes:['rc_id','rc_desc'],
					as:'role_position_fk'
				},
				{
					model:models.reason_code_tbl,
					attributes:['rc_id','rc_desc'],
					as:'role_whLocation_fk'
				},
				{
					model:models.role_tbl,
					attributes:['role_email'],
					as:'creator',
					required:false
				},
				{
					model:models.role_tbl,
					attributes:['role_email'],
					as:'modifier',
					required:false
				}
			]
		})
		.then(result => {
			let {count,rows} = JSON.parse(JSON.stringify(result))

			return {
				rows: rows.map(item => {
					const {role,...roles} = item
					return {
						...roles,
						role_name:role?.role_name
					}
				}),
				count
			}
		})

		return {
			count,
			rows
		}
	}
	catch (error) {
		throw error
	}
}

exports.getDropdownRole = async({
	filters
}) => {
	try {
		return await models.bas_role.findAll({
			where:{
				...filters
			},
			attributes:['role_name','role_id']
		})
		.then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}
