"use strict";

const models = require('../../../models/swift');
const {sequelize, Sequelize} = models;

exports.bulkCreateService = async({
	dataToInsert
}) => {
	try {
		return await sequelize.transaction(async(t1) => {
			return await models.bas_service.bulkCreate(dataToInsert, {
				logging: false,
				transaction : t1
			});
		}).then(result => JSON.parse(JSON.stringify(result)))
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

exports.getPaginatedService = async({
	filters,
	orderBy,
	pageIndex,
	pageSize
}) => {
	try {
		let newFilter = formatFilters({
			model:models.bas_service.rawAttributes,
			filters
		});

		const { count, rows } = await models.bas_service.findAndCountAll({
			where:{
				...newFilter
			},
			offset	: parseInt(pageIndex) * parseInt(pageSize),
			limit	: parseInt(pageSize)
			,order	: [orderBy]
			,include:[
				{
					model: models.bas_quick_code,
					foreignKey: 'service_location',
					as: 'qc_location',
				},
				{
					model: models.bas_quick_code,
					foreignKey: 'service_discipline',
					as: 'qc_discipline',
				},
			]
		})
		.then(result => {
			let { count, rows } = JSON.parse(JSON.stringify(result))

			let mappedRows = rows.map((row) => {
				let { qc_location, qc_discipline, ...rest } = row

				return {
					...rest,
					qc_service_location			: qc_location ? qc_location.qc_code : null,
					qc_service_location_desc	: qc_location ? qc_location.qc_description : null,
					qc_service_discipline		: qc_discipline ? qc_discipline.qc_code : null,
					qc_service_discipline_desc	: qc_discipline ? qc_discipline.qc_description : null
				}
			})

			return {
				rows: mappedRows,
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
	catch (error) {
		throw error
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

exports.getAllServiceByLocation = async({
	filters
}) => {
	try {
		const { count, rows } = await models.bas_service.findAndCountAll({
			where:{
				...filters
			}
			,include:[
				{
					model: models.bas_quick_code,
					foreignKey: 'service_location',
					as: 'qc_location',
				},
				{
					model: models.bas_quick_code,
					foreignKey: 'service_discipline',
					as: 'qc_discipline',
				},
			]
		})
		.then(result => {
			let { count, rows } = JSON.parse(JSON.stringify(result))

			let mappedRows = rows.map((row) => {
				let { qc_location, qc_discipline, ...rest } = row

				return {
					...rest,
					qc_service_location			: qc_location ? qc_location.qc_code : null,
					qc_service_location_desc	: qc_location ? qc_location.qc_description : null,
					qc_service_discipline		: qc_discipline ? qc_discipline.qc_code : null,
					qc_service_discipline_desc	: qc_discipline ? qc_discipline.qc_description : null
				}
			})

			return {
				rows: mappedRows,
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
