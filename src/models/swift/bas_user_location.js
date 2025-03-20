"use strict";

module.exports = (sequelize, DataTypes) => {
	const bas_user_location = sequelize.define('bas_user_location', {
		uuid:{type: DataTypes.STRING(50), primaryKey: true, allowNull: false,},
		user_id:{type: DataTypes.STRING(50), allowNull: false,},
		user_location:{type: DataTypes.STRING(50), allowNull: false,},
		user_location_remarks1:{type: DataTypes.STRING(255), allowNull: true,},
		user_location_remarks2:{type: DataTypes.STRING(255), allowNull: true,},
		user_location_remarks3:{type: DataTypes.STRING(255), allowNull: true,},
		createdBy:{type: DataTypes.STRING(255), allowNull: true,},
		updatedBy:{type: DataTypes.STRING(255), allowNull: true,},
	}, {
		freezeTableName: true,
		timestamps: true,
		hasTrigger: true
	})

	return bas_user_location;
}