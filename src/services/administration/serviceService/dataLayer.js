"use strict";

const models = require('../../../models/swift');
const {sequelize, Sequelize} = models;

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
						user_email: {
							[Sequelize.Op.like]: `%${filters.search}%`
						}
					},
					{
						user_first_name: {
							[Sequelize.Op.like]: `%${filters.search}%`
						}
					},
					{
						user_last_name: {
							[Sequelize.Op.like]: `%${filters.search}%`
						}
					},
					{
						user_contact_no: {
							[Sequelize.Op.like]: `%${filters.search}%`
						}
					},
					{
						user_remarks1: {
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

exports.createService = async({
	...data
}) => {
	try {
		return await models.bas_service.create({
			...data
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.getPaginatedService = async({
	filters,
	orderBy,
	page,
	totalPage
}) => {
	try {
		let newFilter = formatFilters({
			model:models.bas_service.rawAttributes,
			filters
		});

		const {count,rows} = await models.bas_service.findAndCountAll({
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
					as:'user_position_fk'
				},
				{
					model:models.reason_code_tbl,
					attributes:['rc_id','rc_desc'],
					as:'user_whLocation_fk'
				},
				{
					model:models.user_tbl,
					attributes:['user_email'],
					as:'creator',
					required:false
				},
				{
					model:models.user_tbl,
					attributes:['user_email'],
					as:'modifier',
					required:false
				}
			]
		})
		.then(result => {
			let {count,rows} = JSON.parse(JSON.stringify(result))

			return {
				rows: rows.map(item => {
					const {role,...users} = item
					return {
						...users,
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

exports.getService = async({
	filters
}) => {
	try {
		return await models.bas_service.findOne({
			where:{
				...filters
			}
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.getAllService = async({
	filters
}) => {
	try {
		return await models.bas_service.findAll({
			where:{
				...filters
			},
			include:[
				{
					model:models.tbl_administration_user_session,
					attributes:['user_token'],
					required:false,
					as:'user_session'
				}
			]
		})
		.then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.updateService = async({
	filters,
	data,
	options
}) => {
	try {
		return await models.bas_service.update(
			{
				...data
			},
			{
				where:{
					...filters
				}
			}
		).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}
