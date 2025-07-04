"use strict";

module.exports = (sequelize, DataTypes) => {
	const doc_ticket_transaction_log = sequelize.define('doc_ticket_transaction_log', {
		ticket_id: { type: DataTypes.STRING(50), primaryKey: true, allowNull: false },
		ticket_service: { type: DataTypes.STRING(50), allowNull: false },
		ticket_status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: '10' },
		ticket_level: { type: DataTypes.TINYINT(1), allowNull: false, defaultValue: 1 },
		ticket_parent_reference: { type: DataTypes.STRING(50), allowNull: true },
		ticket_head_reference: { type: DataTypes.STRING(50), allowNull: true },
		ticket_counter: { type: DataTypes.STRING(50), allowNull: true },
		ticket_support: { type: DataTypes.STRING(50), allowNull: true },
		ticket_create_datetime: { type: DataTypes.DATE(6), allowNull: false },
		ticket_queue_datetime: { type: DataTypes.DATE(6), allowNull: true },
		ticket_assigned_datetime: { type: DataTypes.DATE(6), allowNull: true },
		ticket_now_serving_datetime: { type: DataTypes.DATE(6), allowNull: true },
		ticket_served_datetime: { type: DataTypes.DATE(6), allowNull: true },
		ticket_no_show_datetime: { type: DataTypes.DATE(6), allowNull: true },
		ticket_cancelled_datetime: { type: DataTypes.DATE(6), allowNull: true },
		ticket_reason_code: { type: DataTypes.STRING(50), allowNull: true },
		ticket_trip_number: { type: DataTypes.STRING(50), allowNull: true },
		ticket_trucker_id: { type: DataTypes.STRING(50), allowNull: true },
		ticket_trucker_name: { type: DataTypes.STRING(50), allowNull: true },
		ticket_vehicle_type: { type: DataTypes.STRING(50), allowNull: true },
		ticket_plate_num: { type: DataTypes.STRING(50), allowNull: true },
		ticket_remarks1: { type: DataTypes.STRING(255), allowNull: true },
		ticket_remarks2: { type: DataTypes.STRING(255), allowNull: true },
		ticket_remarks3: { type: DataTypes.STRING(255), allowNull: true },
		ticket_override: { type: DataTypes.TINYINT(1), allowNull: false, defaultValue: 0 },
		createdBy: { type: DataTypes.STRING(255), allowNull: true },
		updatedBy: { type: DataTypes.STRING(255), allowNull: true },
	}, {
		freezeTableName: true,
		timestamps: true,
		hasTrigger: true
	})

	return doc_ticket_transaction_log;
}