"use strict";

const models = require('../../../models/swift');
const {sequelize, Sequelize} = models;


const formatFilters = ({ model, filters }) => {
	try {
		let formattedFilters = {};

		if (filters.searchTerm && filters.searchTerm !== "") {
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

exports.createUser = async({
	...data
}) => {
	try {
		return await models.bas_user.create({
			...data
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.getPaginatedUser = async({
	filters,
	orderBy,
	pageIndex,
	pageSize
}) => {
	try {
		let newFilter = formatFilters({
			model:models.bas_user.rawAttributes,
			filters
		});

		const { count, rows } = await models.bas_user.findAndCountAll({
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

exports.getUser = async({
	filters
}) => {
	try {
		return await models.bas_user.findOne({
			where:{
				...filters
			}
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.getAllUser = async({
	filters
}) => {
	try {
		return await models.bas_user.findAll({
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

exports.updateUser = async({
	filters,
	data,
	options
}) => {
	try {
		return await models.bas_user.update(
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
