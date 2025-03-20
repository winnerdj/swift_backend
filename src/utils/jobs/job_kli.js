"use strict";

const jobService = require('../../services/job-kli/jobService')
const { mw2dh_SO_Barapido_Posting_Cron
		,mw2dh_PO_Pvm_Posting_Cron
	} = require('../../config/config')

exports.mw2dh_So_BarapidoGenerator = async() => {
	try {
		await jobService.mw2dh_SO_barapido_jobGenerator.removeRepeatable({ jobId: 'mw2dh_SO_Barapido_Post_Generation', repeat: mw2dh_SO_Barapido_Posting_Cron })
		.then((job) => {
			jobService.mw2dh_SO_barapido_jobGenerator.add({
				filters: {
						edi_flag	: false,
						createdBy	: 'admin@barapido.com'
					}
				}, {
					jobId	: 'mw2dh_SO_Barapido_Post_Generation',
					repeat	: { cron : mw2dh_SO_Barapido_Posting_Cron }
					,removeOnComplete: {
						age: 3600 * 24 * 7, /** 3600seconds x 24 x 7 = 7days */
						count: 1000, /** keep up to 1000 jobs */
					}
					,removeOnFail: {
						age: 3600 * 24 * 30, /** 3600seconds x 24 x 30 = 30days */
						count: 3000, /** keep up to 3000 jobs */
					}
				}
			);
		})
	}
	catch(e) {
		console.log(e);
	}
}

exports.mw2dh_Po_PvmGenerator = async() => {
	try {
		await jobService.mw2dh_PO_pvm_jobGenerator.removeRepeatable({ jobId: 'mw2dh_PO_Pvm_Post_Generation', repeat: mw2dh_PO_Pvm_Posting_Cron })
		.then((job) => {
			jobService.mw2dh_PO_pvm_jobGenerator.add({
				filters: {
						edi_flag	: false,
						createdBy	: 'admin@pvm.com'
					}
				}, {
					jobId	: 'mw2dh_PO_Pvm_Post_Generation',
					repeat	: { cron : mw2dh_PO_Pvm_Posting_Cron }
					,removeOnComplete: {
						age: 3600 * 24 * 7, /** 3600seconds x 24 x 7 = 7days */
						count: 1000, /** keep up to 1000 jobs */
					}
					,removeOnFail: {
						age: 3600 * 24 * 30, /** 3600seconds x 24 x 30 = 30days */
						count: 3000, /** keep up to 3000 jobs */
					}
				}
			);
		})
	}
	catch(e) {
		console.log(e);
	}
}
