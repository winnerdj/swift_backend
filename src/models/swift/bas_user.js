"use strict";

module.exports = (sequelize, DataTypes) => {
	const bas_user = sequelize.define('bas_user', {
		user_id: { type: DataTypes.STRING(50), primaryKey: true },
		user_role: { type: DataTypes.STRING(50), allowNull: false },
		user_password: { type: DataTypes.STRING(255), allowNull: false },
		user_status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
		user_email: { type: DataTypes.STRING(255), unique: true },
		user_name: { type: DataTypes.STRING(255) },
		user_first_name: { type: DataTypes.STRING(255) },
		user_middle_name: { type: DataTypes.STRING(255) },
		user_last_name: { type: DataTypes.STRING(255) },
		user_contact_person: { type: DataTypes.STRING(255), allowNull: true },
		user_contact_no: { type: DataTypes.BIGINT },
		user_address: { type: DataTypes.STRING(255) },
		createdBy: { type: DataTypes.STRING(255) },
		updatedBy: { type: DataTypes.STRING(255) },
	}, {
		freezeTableName: true,
		timestamps: true,
		hasTrigger: true
	})

	return bas_user;
}