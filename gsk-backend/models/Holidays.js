const mongoose = require('mongoose');

const HolidaysSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student'
    },
    leave_type: String,
    reason: String,
    start_date: {
        type: Date,
        default: Date.now,
    },
    end_date: {
        type: Date,
        default: Date.now,
    },
    date_applied: {
        type: Date,
        default: Date.now,
    },
    status: Number
});

module.exports = mongoose.model('Holiday', HolidaysSchema);