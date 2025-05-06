"use strict";

const models = require('../../../models/swift');
const {sequelize, Sequelize} = models;

exports.bulkCreateQuickcode = async({
	dataToInsert
}) => {
	try {
		return await sequelize.transaction(async(t1) => {
			return await models.bas_quick_code.bulkCreate(dataToInsert, {
				logging: false,
				transaction : t1
			});
		}).then(result => JSON.parse(JSON.stringify(result)))
	}
	catch(e) {
		throw e
	}
}

exports.createQuickcode = async({
	...data
}) => {
	try {
		return await models.bas_quick_code.create({
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

exports.getPaginatedQuickcode = async({
	filters,
	orderBy,
	pageIndex,
	pageSize
}) => {
	try {
		let newFilter = formatFilters({
			model:models.bas_quick_code.rawAttributes,
			filters
		});

		const { count, rows } = await models.bas_quick_code.findAndCountAll({
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

exports.updateRole = async({
	filters,
	data,
	options
}) => {
	try {
		return await models.bas_quick_code.update(
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
