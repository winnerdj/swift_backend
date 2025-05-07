"use strict";

const dataLayer = require('./dataLayer');

exports.createQuickcode = async({
	...data
}) => {
	try {
		return await dataLayer.createQuickcode({
			...data
		})
	}
	catch(e) {
		throw e
	}
}

exports.getPaginatedQuickcode = async({
	filters
}) => {
	try {
		let { order, pageIndex, pageSize, ...newFilters } = filters;

		order = order ? order : 'updatedAt,DESC';

		return await dataLayer.getPaginatedQuickcode({
			orderBy : order.split(','),
			pageIndex,
			pageSize,
			filters : {
				...newFilters
			}
		})
	}
	catch(e) {
		throw e
	}
}

exports.updateQuickcode = async({
	filters,
	data
}) => {
	try {
		return await dataLayer.updateQuickcode({
			filters,
			data
		})
	}
	catch(e) {
		throw e
	}
}

exports.getDropdownQuickcode = async({
	filters
}) => {
	try {
		return await dataLayer.getDropdownQuickcode({
			filters
		})
	}
	catch(e) {
		throw e
	}
}
