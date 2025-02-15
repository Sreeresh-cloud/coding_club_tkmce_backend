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
    college: {
        type: String,
        required: true,
        enum: ['TKMCE', 'Other'],
    },
    otherCollegeName: {
        type: String,
        required: function() {
            return this.college === 'Other'; 
        }
    },
    branch: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    batch: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C'], // Ensures only A, B, or C can be stored
    },
    emailId: {
        type: String,
        required: true,
        trim: true, 
    },
    mobileNo: {
        type: String,
        required: true,
    },
});

const EventReg = mongoose.model('EventReg', EventRegSchema);
module.exports = EventReg;
