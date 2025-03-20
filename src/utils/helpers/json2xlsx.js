"use strict"

const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

exports.ArrayJson2Xlsx = async({
	arrayJsonData,
	filename,
	outputpath
}) => {
	try {
		let wb = xlsx.utils.book_new();

		for (let i in arrayJsonData) {
			let ws = xlsx.utils.json_to_sheet(arrayJsonData[i].sheetData);

			if(arrayJsonData[i]?.sheetOpts?.['!cols']) {
				ws["!cols"] = arrayJsonData[i]?.sheetOpts?.["!cols"];
			}

			if(arrayJsonData[i]?.colWidth?.['!cols']) {
				ws["!cols"] = arrayJsonData[i]?.colWidth?.["!cols"];
			}

			xlsx.utils.book_append_sheet(wb, ws, arrayJsonData[i].sheetName ?? `Sheet${++i}`);
		}

		let dir = outputpath ?? 'reportGenerated';
		let filepath = path.join(__dirname, `../../../assets/${dir}/`, filename);

		await xlsx.writeFile(wb, filepath);

		const contents = fs.readFileSync(filepath, { encoding: 'base64' });

		return {
			contents,
			filepath,
			filename
		}
	}
	catch (e) {
		console.log(e)
		throw e
	}
};
