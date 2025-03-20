"use strict";

const barapidoJobService = require('../../services/job-barapido/jobService')
const { soh2redis_Cron,
		mw2barapido_SO_Cancel_Status_Cron,
		mw2barapido_SO_Pick_Status_Cron,
		mw2barapido_SO_Issue_Status_Cron,
		salem2mw_Item_Master_Price_Cron,
		mw2barapido_Create_Inventory_Item_Cron
	} = require('../../config/config')

exports.soh2redis = async() => {
	try {
		await barapidoJobService.mw2redis_SOH_job.removeRepeatable({ jobId: 'soh2redis_SOH_Generation', repeat: soh2redis_Cron })
		.then((job) => {
			barapidoJobService.mw2redis_SOH_job.add({
					warehouseId:['PASIG-FMCG']
					,customerId:['DDL-ECOM']
					,sku:['']
				}, {
					jobId: 'soh2redis_SOH_Generation',
					repeat: { cron : soh2redis_Cron }
					,removeOnComplete: {
						age: 3600 * 24 * 7, /** 3600seconds x 24 x 7 = 7days */
						count: 1000, /** keep up to 1000 jobs */
					}
					,removeOnFail: {
						age: 3600 * 24 * 30, /** 3600seconds x 24 x 30 = 30days */
						count: 3000, /** keep up to 3000 jobs */
					}
				}
			)
		})
	}
	catch(e) {
		console.log(e);
	}
}

exports.mw2barapido_SoCancelGenerator = async() => {
	try {
		await barapidoJobService.mw2barapido_SO_Cancel_jobGenerator.removeRepeatable({ jobId: 'mw2barapido_SO_Cancel_Status', repeat: mw2barapido_SO_Cancel_Status_Cron })
		.then((job) => {
			barapidoJobService.mw2barapido_SO_Cancel_jobGenerator.add({
				filters: {
						edi_flag 			: false
						,order_status_code	: '90'
						,warehouse_id		: 'PASIG-FMCG'
						,user_customer		: 'BARAPIDO'
					}
				}, {
					jobId: 'mw2barapido_SO_Cancel_Status',
					repeat: { cron : mw2barapido_SO_Cancel_Status_Cron }
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

exports.mw2barapido_SoPickGenerator = async() => {
	try {
		await barapidoJobService.mw2barapido_SO_Pick_jobGenerator.removeRepeatable({ jobId: 'mw2barapido_SO_Pick_Status', repeat: mw2barapido_SO_Pick_Status_Cron })
		.then((job) => {
			barapidoJobService.mw2barapido_SO_Pick_jobGenerator.add({
				filters: {
						dhsots_edi_flag		: 0
						,order_status_code	: '99'
						,warehouse_id		: 'PASIG-FMCG'
						,user_customer		: 'BARAPIDO'
					}
				}, {
					jobId: 'mw2barapido_SO_Pick_Status',
					repeat: { cron : mw2barapido_SO_Pick_Status_Cron }
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

exports.mw2barapido_SoIssueGenerator = async() => {
	try {
		await barapidoJobService.mw2barapido_SO_Issue_jobGenerator.removeRepeatable({ jobId: 'mw2barapido_SO_Issue_Status', repeat: mw2barapido_SO_Issue_Status_Cron })
		.then((job) => {
			barapidoJobService.mw2barapido_SO_Issue_jobGenerator.add({
				filters: {
					dhsots_edi_flag		: 1
					,order_status_code	: '99'
					,warehouse_id		: 'PASIG-FMCG'
					,user_customer		: 'BARAPIDO'
				}
			}, {
				jobId: 'mw2barapido_SO_Issue_Status',
				repeat: { cron : mw2barapido_SO_Issue_Status_Cron }
				,removeOnComplete: {
					age: 3600 * 24 * 7, /** 3600seconds x 24 x 7 = 7days */
					count: 1000, /** keep up to 1000 jobs */
				}
				,removeOnFail: {
					age: 3600 * 24 * 30, /** 3600seconds x 24 x 30 = 30days */
					count: 3000, /** keep up to 3000 jobs */
				}
			})
		})
	}
	catch(e) {
		console.log(e);
	}
}

exports.salem2mw_Item_Master_Price = async() => {
	try {
		await barapidoJobService.salem2mw_Item_Master_Price_job.removeRepeatable({ jobId: 'salem2mw_Item_Master_Price_Generation', repeat: salem2mw_Item_Master_Price_Cron })
		.then((job) => {
			barapidoJobService.salem2mw_Item_Master_Price_job.add({
					filters : {
						salemFilters: {
							itm_customer	: 'TINDAMI'
						},
						hlsWmsFilters: {
							customerId		: 'DDL-ECOM'
						}
					},
				}, {
					jobId: 'salem2mw_Item_Master_Price_Generation',
					repeat: { cron : salem2mw_Item_Master_Price_Cron }
					,removeOnComplete: {
						age: 3600 * 24 * 7, /** 3600seconds x 24 x 7 = 7days */
						count: 1000, /** keep up to 1000 jobs */
					}
					,removeOnFail: {
						age: 3600 * 24 * 30, /** 3600seconds x 24 x 30 = 30days */
						count: 3000, /** keep up to 3000 jobs */
					}
				}
			)
		})
	}
	catch(e) {
		console.log(e);
	}
}

exports.mw2barapido_Create_Inventory_ItemGenerator = async() => {
	try {
		await barapidoJobService.mw2barapido_Create_Inventory_Item_jobGenerator.removeRepeatable({ jobId: 'mw2barapido_Create_Inventory_Item', repeat: mw2barapido_Create_Inventory_Item_Cron })
		.then((job) => {
			barapidoJobService.mw2barapido_Create_Inventory_Item_jobGenerator.add({}, {
				jobId: 'mw2barapido_Create_Inventory_Item',
				repeat: { cron : salem2mw_Item_Master_Price_Cron }
				,removeOnComplete: {
					age: 3600 * 24 * 7, /** 3600seconds x 24 x 7 = 7days */
					count: 1000, /** keep up to 1000 jobs */
				}
				,removeOnFail: {
					age: 3600 * 24 * 30, /** 3600seconds x 24 x 30 = 30days */
					count: 3000, /** keep up to 3000 jobs */
				}
			})
		})
	}
	catch(e) {
		console.log(e);
	}
}
