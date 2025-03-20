"use strict";

module.exports = (sequelize, DataTypes) => {
	const bas_role = sequelize.define('bas_role', {
		role_id: { type: DataTypes.STRING(50), primaryKey: true },
		role_name: { type: DataTypes.STRING(50), allowNull: false, defaultValue: '' },
		role_description: { type: DataTypes.STRING(255) },
		role_status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
		role_remarks1: { type: DataTypes.STRING(255) },
		role_remarks2: { type: DataTypes.STRING(255) },
		role_remarks3: { type: DataTypes.STRING(255) },
		createdBy: { type: DataTypes.STRING(255) },
		updatedBy: { type: DataTypes.STRING(255) },
	}, {
		freezeTableName: true,
		timestamps: true,
		hasTrigger: true
	})

	return bas_role;
}