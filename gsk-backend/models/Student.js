const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	name: String,
	email: String,
	mudid: String,
	password: String
});

// Hashing Password
StudentSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Comparing Password
StudentSchema.methods.correctPassword = async function (password, userPassword) {
	return await bcrypt.compare(password, userPassword);
};

module.exports = mongoose.model('Student', StudentSchema);
