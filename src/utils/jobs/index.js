const job_pvm = require('./jobs-pvm')
const job_barapido = require('./jobs-barapido')
const job_kli = require('./job_kli')

module.exports = async() => {
	try {
		/**KLI Workers */
		// job_kli.mw2dh_So_BarapidoGenerator();
		// job_kli.mw2dh_Po_PvmGenerator();

		/**BARAPIDO Workers */
		// job_barapido.soh2redis();
		// job_barapido.mw2barapido_SoCancelGenerator();
		// job_barapido.mw2barapido_SoPickGenerator();
		// job_barapido.mw2barapido_SoIssueGenerator();
		// job_barapido.salem2mw_Item_Master_Price();
		// job_barapido.mw2barapido_Create_Inventory_ItemGenerator();

		/**PVM Workers */
		// job_pvm.pvm2mw_GR103();
		// job_pvm.mw2pvm_GR105();
		// job_pvm.pvm2mw_GR101_Promat();
		// job_pvm.mw2pvm_GRConf_Promat();

	}
	catch (e) {
		throw e
	}
}
