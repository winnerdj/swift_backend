"use strict";

module.exports = (sequelize, DataTypes) => {
	const user_activity_log = sequelize.define('user_activity_log', {
		log_id: { type: DataTypes.STRING(50), primaryKey: true, allowNull: false, defaultValue: DataTypes.UUIDV4 },
		user_id: { type: DataTypes.STRING(255), allowNull: false },
		activity: { type: DataTypes.STRING(255), allowNull: false },
		location: { type: DataTypes.STRING(255), allowNull: false },
		service_id: { type: DataTypes.STRING(255), allowNull: true },
		counter: { type: DataTypes.STRING(255), allowNull: true },
		user_status: { type: DataTypes.STRING(255), allowNull: true },
		reason_code: { type: DataTypes.STRING(255), allowNull: true },
		start_datetime: { type: DataTypes.DATE(6), allowNull: false },
		duration: { type: DataTypes.INTEGER, allowNull: true },
		createdBy: { type: DataTypes.STRING(255), allowNull: true },
		updatedBy: { type: DataTypes.STRING(255), allowNull: true },
	}, {
		freezeTableName: true,
		timestamps: true,
		hasTrigger: true
	})

	return user_activity_log;
}
