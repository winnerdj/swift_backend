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

const formatFilters = ({ model, filters }) => {
	try {
		let formattedFilters = {};

		if(filters.searchTerm && filters.searchTerm !== "") {
			let headers = Object.keys(model).filter(
				(h) => !["createdAt", "updatedAt"].includes(h)
			);

			// Properly format Op.or conditions
			formattedFilters = {
				[Sequelize.Op.or]: headers.map((field) => ({
					[field]: { [Sequelize.Op.like]: `%${filters.searchTerm}%` },
				})),
			};
		} else {
			delete filters.searchTerm;
			formattedFilters = filters;
		}

		return formattedFilters;
	} catch (e) {
		throw e;
	}
};

exports.getPaginatedRole = async({
	filters,
	orderBy,
	pageIndex,
	pageSize
}) => {
	try {
		let newFilter = formatFilters({
			model:models.bas_role.rawAttributes,
			filters
		});

		const { count, rows } = await models.bas_role.findAndCountAll({
			where:{
				...newFilter
			},
			offset	: parseInt(pageIndex) * parseInt(pageSize),
			limit	: parseInt(pageSize)
			,order	: [orderBy]
		})
		.then(result => {
			let {count,rows} = JSON.parse(JSON.stringify(result))

			return {
				rows,
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

exports.updateRole = async({
	filters,
	data,
	options
}) => {
	try {
		return await models.bas_role.update(
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
