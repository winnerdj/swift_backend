"use strict";

const jobService = require('../../services/jobs/swiftService/jobService');
const { assignt_ticket_frequency } = require('../../config/config')


exports.Assign_Ticket_Work = async() => {
	try {
		await jobService.assign_ticket_job.removeRepeatable({ jobId: 'assign_ticket_job', repeat: assignt_ticket_frequency })
		.then((job) => {
			jobService.assign_ticket_job.add({
				payloadData: {
						ticket_status	: 10
					}
				}, {
					jobId	: 'assign_ticket_job',
					repeat	: { every: assignt_ticket_frequency }
					,removeOnComplete: {
						count: 30, /** keep up to 30 jobs */
					}
					,removeOnFail: {
						count: 60, /** keep up to 60 jobs */
					}
				}
			);
		})
	}
	catch(e) {
		console.log(e);
	}
}
