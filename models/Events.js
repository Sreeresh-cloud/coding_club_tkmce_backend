// eventModel.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventDescription: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventVenue: { type: String, required: true },
    eventImage: { type: String, required: false }, // Store image URL or file path
    eventMode: { type: String, enum: ["Online", "Offline"], required: true },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
