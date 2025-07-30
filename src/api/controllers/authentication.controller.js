"use strict";

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const moment = require('moment');
const Redis = require('redis');

const { userService, authService } = require('../../services/administration');
const { redisConfig } = require('../../config/config');
const { generateTempPassword, emailTemporaryPassword } = require('../../utils/helpers/helper');

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

		const userDetails = await userService.getUserDetails({
			filters: {
				user_id
			}
		})

		if(!userDetails) {
			return res.status(404).json({
				message: 'User not found.'
			})
		}

		if(!userDetails.user_status) {
			return res.status(400).json({
				message: 'User inactive.'
			})
		}

		if(!bcrypt.compareSync(user_password, userDetails.user_password)) {
			return res.status(400).json({
				message: 'User password incorrect.'
			})
		}

		const token = await authService.generateUserToken({
			user_id: userDetails.user_id,
			user_name: userDetails.user_name
		})

		if(!redisClient.isOpen) {
			await redisClient.connect()
		}

		await redisClient.json.set(`swift:session:${user_id}`, '.', token)

		res.status(200).json({
			user_id,
			token,
			userDetails
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
		const { user_id, current_password, new_password } = req.body;

		const getUser = await userService.getUserDetails({
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

		if(!bcrypt.compareSync(current_password, getUser.user_password)) {
			return res.status(400).json({
				message: 'Old password is incorrect'
			})
		}

		let updatedUser = await userService.updateUser({
			filters: { user_id },
			data: {
				user_new_password : new_password 
			}
		})

		if(!updatedUser) {
			throw new Error('User password not updated.')
		}

		res.status(200).json({ updatedRow : updatedUser[0] })
	}
	catch(err) {
		err.statusCode = 500;
		next(err)
	}
}

exports.forgotPassword = async(req, res, next) => {
	try {
		const { user_email } = req.body;

		const user = await userService.getUser({
			filters: { user_email }
		})

		if(!user) throw new Error('User not found.');

		let user_password = await generateTempPassword();

		let updatedUser = await userService.updateUser({
			filters:{
				user_email
			},
			data : {
				user_password,
				user_new: 1
			}
		})

		console.log("🚀 ------------------------------------------------------------------------------------------------🚀");
		console.log("🚀 ~ authentication.controller.js:146 ~ exports.forgotPassword=async ~ updatedUser:", updatedUser);
		console.log("🚀 ------------------------------------------------------------------------------------------------🚀");

		if(!updatedUser) {
			return await emailTemporaryPassword({
				email_address: user.user_email,
				useer_id: user.user_id,
				tempPassword: user_password
			})
		}
		else {
			throw new Error('User password not updated.');
		}
	}
	catch(e) {
		throw e
	}
}
