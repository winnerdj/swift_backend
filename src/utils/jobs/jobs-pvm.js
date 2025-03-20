"use strict";

const pvmJobService = require('../../services/job-pvm/jobService')
const { pvm2mw_GR103_Cron
		,mw2pvm_GR105_Cron
		,pvm2mw_GR101_Promat_Cron
		,mw2pvm_GRConf_Promat_Cron
} = require('../../config/config')

exports.pvm2mw_GR103 = async() => {
	try {
		await pvmJobService.pvm2mw_GR103_jobGenerator.removeRepeatable({ jobId: 'pvm2mw_GR103', repeat: pvm2mw_GR103_Cron })
		.then((job) => {
			pvmJobService.pvm2mw_GR103_jobGenerator.add({
				pvmFtpDirectory : '/3PL/DEV/SAP_TO_3PL/GOODSRECEIPT/IN/',
				kliFtpDirectory : '/mesi/pvm/SAP_TO_3PL/GOODSRECEIPT/'
			}, {
				jobId: 'pvm2mw_GR103',
				repeat: { cron : pvm2mw_GR103_Cron }
				,removeOnComplete: {
					age: 3600 * 24 * 7, /** 3600seconds x 24 x 7 = 7days */
					//count: 1000, /** keep up to 1000 jobs */
				}
				,removeOnFail: {
					age: 3600 * 24 * 30, /** 3600seconds x 24 x 30 = 30days */
				}
			})
		})
	}
	catch(e) {
		console.log(e);
	}
}

exports.mw2pvm_GR105 = async() => {
	try {
		await pvmJobService.mw2pvm_GR105_jobGenerator.removeRepeatable({ jobId: 'mw2pvm_GR105', repeat: mw2pvm_GR105_Cron })
		.then((job) => {
			pvmJobService.mw2pvm_GR105_jobGenerator.add({
				filters			: {
					edi_flag	 : 0,
					customer_id	 : 'ICL-PVM'
				},
				pvmFtpDirectory : '/3PL/DEV/3PL_TO_SAP/GOODSRECEIPT/IN/',
				kliFtpDirectory : '/mesi/pvm/3PL_TO_SAP/GOODSRECEIPT/'
			}, {
				jobId: 'mw2pvm_GR105',
				repeat: { cron : mw2pvm_GR105_Cron }
				,removeOnComplete: {
					age: 3600 * 24 * 7, /** 3600seconds x 24 x 7 = 7days */
					count: 1000, /** keep up to 1000 jobs */
				}
				,removeOnFail: {
					age: 3600 * 24 * 30, /** 3600seconds x 24 x 30 = 30days */
				}
			})
		})
	}
	catch(e) {
		console.log(e);
	}
}

exports.pvm2mw_GR101_Promat = async() => {
	try {
		await pvmJobService.pvm2mw_GR101_Promat_jobGenerator.removeRepeatable({ jobId: 'pvm2mw_GR101_Promat', repeat: pvm2mw_GR101_Promat_Cron })
		.then((job) => {
			pvmJobService.pvm2mw_GR101_Promat_jobGenerator.add({
				pvmFtpDirectory : '/3PL/DEV/SAP_TO_3PL/GOODSRECEIPT/IN/',
				kliFtpDirectory : '/mesi/pvm/SAP_TO_3PL/GOODSRECEIPT/'
			}, {
				jobId: 'mw2pvm_GR101_Promat',
				repeat: { cron : pvm2mw_GR101_Promat_Cron }
				,removeOnComplete: {
					age: 3600 * 24 * 7, /** 3600seconds x 24 x 7 = 7days */
					//count: 1000, /** keep up to 1000 jobs */
				}
				,removeOnFail: {
					age: 3600 * 24 * 30, /** 3600seconds x 24 x 30 = 30days */
				}
			})
		})
	}
	catch(e) {
		console.log(e);
	}
}

exports.mw2pvm_GRConf_Promat = async() => {
	try {
		await pvmJobService.mw2pvm_GRConf_Promat_jobGenerator.removeRepeatable({ jobId: 'mw2pvm_GRConf_Promat', repeat: mw2pvm_GRConf_Promat_Cron })
		.then((job) => {
			pvmJobService.mw2pvm_GRConf_Promat_jobGenerator.add({
				filters			: {
					edi_flag	: 0,
					customer_id	: 'ICL-PVM'
				},
				pvmFtpDirectory : '/3PL/DEV/3PL_TO_SAP/GOODSRECEIPT/IN/',
				kliFtpDirectory : '/mesi/pvm/3PL_TO_SAP/GOODSRECEIPT/'
			}, {
				jobId: 'mw2pvm_GRConf_Promat',
				repeat: { cron : mw2pvm_GRConf_Promat_Cron }
				,removeOnComplete: {
					age: 3600 * 24 * 7, /** 3600seconds x 24 x 7 = 7days */
					count: 1000, /** keep up to 1000 jobs */
				}
				,removeOnFail: {
					age: 3600 * 24 * 30, /** 3600seconds x 24 x 30 = 30days */
				}
			})
		})
	}
	catch(e) {
		console.log(e);
	}
}
