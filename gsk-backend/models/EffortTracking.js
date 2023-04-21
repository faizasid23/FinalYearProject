const mongoose = require('mongoose');

const EffortTrackingSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Student'
    },
    project_code: String,
    project_name: String,
    hours: String,
    hours_against: String,
    mode: String,
    status: Number
});

module.exports = mongoose.model('EffortTracking', EffortTrackingSchema);