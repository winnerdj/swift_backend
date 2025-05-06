"use strict";

module.exports = (sequelize, DataTypes) => {
	const bas_quick_code = sequelize.define('bas_quick_code', {
		qc_id: { type: DataTypes.STRING(100), primaryKey: true },
		qc_type: { type: DataTypes.STRING(50), unique: 'compositeIndex', allowNull: false },
		qc_code: { type: DataTypes.STRING(50), unique: 'compositeIndex', allowNull: false },
		qc_description: { type: DataTypes.STRING(255), allowNull: false },
		qc_status: { type: DataTypes.BOOLEAN, defaultValue: 1 },
		qc_alternative_code1: { type: DataTypes.STRING(255), allowNull: true },
		qc_alternative_code2: { type: DataTypes.STRING(255), allowNull: true },
		qc_alternative_code3: { type: DataTypes.STRING(255), allowNull: true },
		qc_remarks1: { type: DataTypes.STRING(255) },
		qc_remarks2: { type: DataTypes.STRING(255) },
		qc_remarks3: { type: DataTypes.STRING(255) },
		createdBy: { type: DataTypes.STRING(255) },
		updatedBy: { type: DataTypes.STRING(255) }
		}, {
			freezeTableName: true,
			timestamps: true,
			hasTrigger: true
		})

	return bas_quick_code;
}