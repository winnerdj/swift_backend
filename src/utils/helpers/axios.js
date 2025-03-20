"use strict";

const axios = require('axios').default;
const https = require('https')

const { axiosDatahubConfig,
	axiosBarapidoConfig } = require('../../config/config')

exports.axiosDatahub = axios.create({
	...axiosDatahubConfig,
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
})

exports.axiosBarapido = axios.create({
	...axiosBarapidoConfig,
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
})
