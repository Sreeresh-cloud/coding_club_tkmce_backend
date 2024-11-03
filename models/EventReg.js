// models/EventReg.js
const mongoose = require('mongoose');

const EventRegSchema = new mongoose.Schema({
    eventTitle: {
        type: String,
        required: true,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        trim: true, // Remove whitespace from the start and end
    },
    mobileNo: {
        type: String,
        required: true,
    },
});

// Export the model
const EventReg = mongoose.model('EventReg', EventRegSchema);
module.exports = EventReg;
