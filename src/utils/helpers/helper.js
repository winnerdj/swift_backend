var generator = require('generate-password');
const nodemailer = require('nodemailer');
const { EMAIL_PASS, EMAIL_USER } = require('../../config/config');

exports.generateTempPassword = async() => {
	return generator.generate({
		length: 12, // Set password length
		numbers: true,
		symbols: true,
		uppercase: true,
		lowercase: true,
		strict: true, // Ensures at least one of each type
	});
}

const emailer = async ({
	...contents
}) => {
	try {
		/** Create reusable transporter object using the default SMTP transport */
		let transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false, /** true for 465, false for other ports */
			auth: {
				user: `${process.env.EMAIL_USER}`, /** generated ethereal user */
				pass: `${process.env.EMAIL_PASS}`, /** generated ethereal password */
			},
		});

		/** send mail with defined transport object */
		await transporter.sendMail({
			...contents,
			from: process.env.EMAIL_USER, /** sender address */
			});
	}
	catch(e) {
		throw e
	}
}

exports.emailTemporaryPassword = async({
	email_address,
	user_id,
	tempPassword
}) => {
	try {
		await emailer({
			to: email_address, /** list of receivers */
			subject: "Swift QMS Forgot Password", /** Subject line */
			html:
				`Dear User,`
				+ "<br><br>"
				+ "We are reaching out to inform you that your login account for the Swift System has been reset. Please find below the necessary information to access your account:"
				+ "<br><br>"
				+ "Username: <b>" + user_id + "</b>"
				+ "<br>"
				+ "Password: <b>" + tempPassword + "</b>"
				+ "<br><br>"
				+ "For security reasons, we strongly recommend that you log in to the Swift System using the provided credentials as soon as possible. Once logged in, please proceed to change your password immediately. This will help ensure the confidentiality of your account and protect your sensitive information.", // html body
		});
	}
	catch(e) {
		throw e
	}
}

exports.emailNewAccount = async({
	email_address,
	user_id,
	tempPassword
}) => {
	try {
		await emailer({
			to: email_address, /** list of receivers */
			subject: "Swift QMS New Account", /** Subject line */
			html:
				`Dear User,`
				+ "<br><br>"
				+ "We are reaching out to inform you that your credentials for the Swift System is now active in the system. Please find below the necessary information to access your account:"
				+ "<br><br>"
				+ "Username: <b>" + user_id + "</b>"
				+ "<br>"
				+ "Password: <b>" + tempPassword + "</b>"
				+ "<br><br>"
				+ "For security reasons, we strongly recommend that you log in to the Swift System using the provided credentials as soon as possible. Once logged in, please proceed to change your password immediately. This will help ensure the confidentiality of your account and protect your sensitive information.", // html body
		});
	}
	catch(e) {
		throw e
	}
}
