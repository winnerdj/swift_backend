const Bull = require('bull')
const moment = require('moment')

const { redisBullOptions } = require('../../../config/config');
const redisBullOptions_kli = {
	...redisBullOptions,
	prefix: ''.concat(redisBullOptions.prefix,':kli')
}

const ticketService = require('../../transactions/ticketService');
const userActivityService = require('../../transactions/userActivityService');

const assign_ticket_job = new Bull('Assign ticket', redisBullOptions_kli)

/**Register process: Assign ticket to available user */
assign_ticket_job.process(async(payload, done) => {
	try {
		/** STEP 1: Get all waiting tickets */
		payload.progress(15); payload.log(`1. Fetching active tickets.`);
		let { count, rows } = await ticketService.getAllWaitingTickets({
			ticket_status: 10 // Assuming 10 means "waiting"
		});

		if(count > 0) {
			let numOfTicketTypes = rows.reduce((acc, ticket) => {
				if(!acc.includes(ticket.ticket_service)) {
					acc.push(ticket.ticket_service);
				}
				return acc;
			}, []).length;

			payload.progress(30); payload.log(`2. Found ${count} ticket/s. Unique number of ticket type/s: ${numOfTicketTypes}.`);

			/** STEP 2: Get available users */
			let availableUsers = await userActivityService.getAvailableAgents();
			if(!availableUsers || availableUsers.length === 0) {
				payload.progress(100); payload.log("3. No available users found. Exiting job.");
				done();
				return;
			}
			payload.progress(45); payload.log(`3. Found ${availableUsers.length} user/s.`);

			/** STEP 3: Assign tickets to available users. */
			// We'll keep track of assigned ticket IDs to remove them from the 'rows' array
			// for the current job run, to prevent immediate re-assignment within the same loop.
			const assignedTicketIds = new Set();

			for(let user of availableUsers) {
				// Filter out tickets that have already been assigned in this job run
				let availableUserTickets = rows.filter(ticket =>
					ticket.ticket_service === user.service_id &&
					!assignedTicketIds.has(ticket.ticket_id)
				);

				// Sort by creation datetime (oldest first)
				availableUserTickets.sort((a, b) => {
					return moment(a.ticket_create_datetime).valueOf() - moment(b.ticket_create_datetime).valueOf();
				});

				if(availableUserTickets.length > 0) {
					const ticketToAssign = availableUserTickets[0];
					payload.log(`4. Assigning ${ticketToAssign.ticket_id} ticket to user ${user.user_id}.`);

					// 1. Assign the ticket
					await ticketService.assignTicketToUser({
						updateTicketData : {
							ticket_support: user.user_id,
							ticket_assigned_datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
							ticket_counter: user.counter,
							ticket_status: 50
						},
						ticket_id: ticketToAssign.ticket_id
					});

					// Add the ticket ID to our set to prevent re-assignment within this loop
					assignedTicketIds.add(ticketToAssign.ticket_id);
				}
			}

			// Moved this log here, as it better reflects the assignment process.
			payload.progress(75); payload.log(`5. Finished attempting to assign tickets to users.`);
		} else {
			payload.progress(100); payload.log("2. No waiting tickets found. Exiting job.");
		}

		/** STEP 7: Done*/
		payload.progress(100); payload.log("Done");
		done();
	} catch (error) {
		console.error("Error in assign_ticket_job:", error);
		done(error); // Pass the error to done to mark the job as failed
	}
});
module.exports = {
	assign_ticket_job
}
