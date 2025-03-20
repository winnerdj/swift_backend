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

exports.sendEmailTempPassword = async({
    email_address,
    tempPassword
}) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, /** true for 465, false for other ports */
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        }
    })

    await transporter.sendMail({
        from: EMAIL_USER,
        to: email_address,
        subject: 'Swift Temporary Password',
        text: `Your temporary password is:	${tempPassword}`,
    });
}
