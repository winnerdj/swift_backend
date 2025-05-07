"use strict";

module.exports = (sequelize, DataTypes) => {
	const bas_service = sequelize.define('bas_service', {
		service_id: { type: DataTypes.STRING(50), primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
		service_location: { type: DataTypes.STRING(255), allowNull: false },
		service_name: { type: DataTypes.STRING(255), allowNull: false },
		service_status: { type: DataTypes.TINYINT(1), allowNull: true, defaultValue: 1 },
		service_description: { type: DataTypes.STRING(255), allowNull: false },
		service_discipline: { type: DataTypes.STRING(255), allowNull: true },
		no_of_counters: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
		counter_prefix: { type: DataTypes.STRING(50), allowNull: false },
		ticket_number_prefix: { type: DataTypes.STRING(50), allowNull: false },
		recall_waiting_flag: { type: DataTypes.TINYINT(1), allowNull: true, defaultValue: 1 },
		recall_waiting_time: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 },
		service_remarks1: { type: DataTypes.STRING(255), allowNull: true },
		service_remarks2: { type: DataTypes.STRING(255), allowNull: true },
		service_remarks3: { type: DataTypes.STRING(255), allowNull: true },
		createdBy: { type: DataTypes.STRING(255), allowNull: true },
		updatedBy: { type: DataTypes.STRING(255), allowNull: true },
	}, {
		freezeTableName: true,
		timestamps: true,
		hasTrigger: true
	})

	return bas_service;
}