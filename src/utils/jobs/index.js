const job_kli = require('./job_kli')

module.exports = async() => {
	try {
		/**KLI Workers */
		job_kli.Assign_Ticket_Work();

	}
	catch (e) {
		throw e
	}
}
