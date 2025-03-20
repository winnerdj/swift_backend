"use strict";

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const moment = require('moment');
const Redis = require('redis');

const { userService, authService } = require('../../services/administration');
const { redisConfig } = require('../../config/config');

const redisClient = Redis.createClient({
	...redisConfig
})

exports.testConnection = async(req, res) => {
	try {
		res.status(200).json({
			success: true
		}).end()
	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: `${e}`
		})
	}
}

exports.loginUser = async(req, res) => {
	try {
		const { user_id, user_password } = req.body;

		const getUser = await userService.getUser({
			filters: {
				user_id
			}
		})

		if (!getUser) {
			return res.status(404).json({
				message: 'User not found.'
			})
		}

		if (!getUser.user_status) {
			return res.status(400).json({
				message: 'User inactive.'
			})
		}

		if (!bcrypt.compareSync(user_password, getUser.user_password)) {
			return res.status(400).json({
				message: 'User password incorrect.'
			})
		}

		const token = await authService.generateUserToken({
			user_id: getUser.user_id,
			user_name: getUser.user_name
		})

		if(!redisClient.isOpen) {
			await redisClient.connect()
		}

		await redisClient.json.set(`swift:session:${user_id}`, '.', token)

		res.status(200).json({
			user_id,
			token
		})
	}
	catch (e) {
		console.log(e);
		res.status(500).json({
			message: `${e}`
		})
	}
}

exports.changePassword = async(req, res, next) => {
	try {
		const { user_id, user_old_password, user_new_password } = req.body?.data;

		const getUser = await userService.getUser({
			filters: {
				user_id
			}
		})

		if (!getUser) {
			return res.status(400).json({
				message: 'User not found'
			})
		}

		if (!getUser.user_status) {
			return res.status(400).json({
				message: 'User inactive'
			})
		}

		if (!bcrypt.compareSync(user_old_password, getUser.user_password)) {
			return res.status(400).json({
				message: 'Old password is incorrect'
			})
		}

		await userService.updateUser({
			filters: { user_id },
			data: { user_new_password }
		})

		res.status(200).end()
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}
