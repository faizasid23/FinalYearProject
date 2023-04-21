const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ManagerSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	name: String,
	email: String,
	mudid: String,
	password: { type: String, select: false }
});

// Hashing Password
ManagerSchema.pre('save', async function (next) {
	// if (!this.isModified('password')) {
	// 	next();
	// }

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Comparing Password
ManagerSchema.methods.correctPassword = async function (password, userPassword) {
	return await bcrypt.compare(password, userPassword);
};

module.exports = mongoose.model('Manager', ManagerSchema);
