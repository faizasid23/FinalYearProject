const mongoose = require('mongoose');

const TimesheetsSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student'
    },
    date: {
        type: Date,
        default: Date.now,
    },
    checkin: String,
    checkout: String,
    hours: String,
    student_earned_amount: Number,
    status: Number
});

module.exports = mongoose.model('Timesheet', TimesheetsSchema);