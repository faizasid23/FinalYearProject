const nodemailer = require('nodemailer');

const sendEmail = async options => {
	// 1) Create a transporter
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		// Created a fake account on gmail
		auth: {
			user: "Lucygrahm67@gmail.com",
			pass: "yslcwfkdtdgnxaxk",
		},
	});

	// 2) Define the email options
	const mailOptions = {
		from: 'GSK <sarmad@gsk.com> ',
		to: options.email,
		subject: options.subject,
		text: options.message,
		html: options.body,
	};

	// 3) Actually send the email
	return await transporter.sendMail(mailOptions).then((data) => {
		if (data.response) return true;
		else return false;
	});
};

module.exports = sendEmail;