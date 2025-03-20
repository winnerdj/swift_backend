"use strict";

module.exports = (sequelize, DataTypes) => {
	const bas_role_access = sequelize.define('bas_role_access', {
		role_id: { type: DataTypes.STRING(50), primaryKey: true },
		module_id: { type: DataTypes.STRING(50), primaryKey: true },
		role_access_status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
		role_access_remarks1: { type: DataTypes.STRING(255) },
		role_access_remarks2: { type: DataTypes.STRING(255) },
		role_access_remarks3: { type: DataTypes.STRING(255) },
		createdBy: { type: DataTypes.STRING(255) },
		updatedBy: { type: DataTypes.STRING(255) },
	}, {
		freezeTableName: true,
		timestamps: true,
		hasTrigger: true
	})

	return bas_role_access;
}