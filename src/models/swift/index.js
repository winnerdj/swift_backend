const fs = require('fs');
const path = require('path');
const moment = require('moment');
const basename = path.basename(__filename);
const Sequelize = require('sequelize');

const { swiftDbConfig } = require('../../config/config');

const sequelize = new Sequelize({
	...swiftDbConfig,
	logging: false
	// logging: function(str) {
	// 	console.log(`QMS:swift_db: MySQL ${moment().format('YY-MM-DD_HH:mm:ss.SSS')}: ${str}`);
	// }
});

let db = {};

fs.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		let model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/** Associations **/

// bas_role -> bas_user (One-to-Many)
db.bas_role.hasMany(db.bas_user, {
	foreignKey: 'user_role',
	as: 'users'
});
db.bas_user.belongsTo(db.bas_role, {
	foreignKey: 'user_role',
	as: 'role'
});

// bas_role -> bas_role_access (One-to-Many)
db.bas_role.hasMany(db.bas_role_access, {
	foreignKey: 'role_id',
	as: 'roleAccess'
});
db.bas_role_access.belongsTo(db.bas_role, {
	foreignKey: 'role_id',
	as: 'role'
});

// bas_quick_code -> bas_role_access (One-to-Many, module_id references qc_id)
db.bas_quick_code.hasMany(db.bas_role_access, {	
	foreignKey: 'module_id',
	as: 'roleAccessModules'
});
db.bas_role_access.belongsTo(db.bas_quick_code, {
	foreignKey: 'module_id',
	as: 'module'
});

// bas_user -> bas_user_location (One-to-Many)
db.bas_user.hasMany(db.bas_user_location, {
	foreignKey: 'user_id',
	as: 'locations'
});
db.bas_user_location.belongsTo(db.bas_user, {
	foreignKey: 'user_id',
	as: 'user'
});

// bas_quick_code -> bas_user_location (One-to-Many, user_location references qc_id)
db.bas_quick_code.hasMany(db.bas_user_location, {
	foreignKey: 'user_location',
	as: 'userLocations'
});
db.bas_user_location.belongsTo(db.bas_quick_code, {
	foreignKey: 'user_location',
	as: 'location'
});

// bas_service -> bas_quick_code
db.bas_service.belongsTo(db.bas_quick_code, {
	targetKey: 'qc_id',
	foreignKey: 'service_location',
	as: 'qc_location'
});

db.bas_service.belongsTo(db.bas_quick_code, {
	targetKey: 'qc_id',
	foreignKey: 'service_discipline',
	as: 'qc_discipline'
});

// doc_ticket_transaction_log -> bas_service
db.doc_ticket_transaction_log.belongsTo(db.bas_service, {
	targetKey: 'service_id',
	foreignKey: 'ticket_service',
	as: 'srv_ticket_service'
});

// doc_ticket_transaction_log -> bas_quick_code
db.doc_ticket_transaction_log.belongsTo(db.bas_quick_code, {
	targetKey: 'qc_code',
	foreignKey: 'ticket_status',
	as: 'qc_ticket_status'
});

db.doc_ticket_transaction_log.belongsTo(db.bas_service, {
	targetKey: 'service_id',
	foreignKey: 'ticket_service',
	as: 'ticketService'
});

// user_activity_log -> bas_service
db.user_activity_log.belongsTo(db.bas_service, {
	targetKey: 'service_id',
	foreignKey: 'service_id',
	as: 'srv_user_activity'
});

// user_activity_log -> bas_quick_code
db.user_activity_log.belongsTo(db.bas_quick_code, {
	targetKey: 'qc_id',
	foreignKey: 'location',
	as: 'qc_loc_user_activity'
});

// bas_service -> doc_ticket_transaction_log (One-to-Many)
db.bas_service.hasMany(db.doc_ticket_transaction_log, {
	foreignKey: 'ticket_service',
	as: 'tickets'
});
db.doc_ticket_transaction_log.belongsTo(db.bas_service, {
	foreignKey: 'ticket_service',
	as: 'service'
});

// bas_user -> doc_ticket_transaction_log (One-to-Many, ticket_support references user_id)
db.bas_user.hasMany(db.doc_ticket_transaction_log, {
	foreignKey: 'ticket_support',
	as: 'supportedTickets'
});
db.doc_ticket_transaction_log.belongsTo(db.bas_user, {
	foreignKey: 'ticket_support',
	as: 'supportUser'
});

module.exports = db;