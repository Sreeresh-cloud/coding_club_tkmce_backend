const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Event = require("./models/Events"); 
const multer = require("multer");
const EventReg =require("./models/EventReg")
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); 

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true,tlsAllowInvalidCertificates: true})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
    res.json({ status: 'active' }); 
});

app.post("/events", upload.single("image"), async (req, res) => {
    const { name, description, date, venue, mode } = req.body;

    let eventImage;
    if (req.file) {
        console.log("File received:", req.file);
        eventImage = req.file.buffer.toString("base64");
        console.log("No file received");

    }

    const newEvent = new Event({
        eventName: name,
        eventDescription: description,
        eventDate: date,
        eventVenue: venue,
        eventImage: eventImage,
        eventMode: mode,
    });

    try {
        await newEvent.save();
        res.status(201).json({ message: "Event added successfully!" });
    } catch (error) {
        console.error("Error saving event:", error);
        res.status(500).json({ message: "Error saving event", error: error.message });
    }
});

app.get('/events', async (req, res) => {
    try {
        const events = await Event.find(); 
        res.status(200).json(events); 
    } catch (error) {
        console.error("Error fetching events", error);
        res.status(500).send("Error fetching events");
    }
});

app.post('/register', async (req, res) => {
    const { name, branch, year, emailId, mobileNo, eventTitle, eventDate } = req.body;

    try {
        const newRegistration = new EventReg({
            eventTitle,
            eventDate,
            name,
            branch,
            year,
            emailId,
            mobileNo,
        });

        await newRegistration.save();
        return res.status(201).json({ message: 'Registration successful', registration: newRegistration });
    } catch (error) {
        console.error('Error registering for event:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/events/:eventName/registrations', async (req, res) => {
    try {
        const eventName = req.params.eventName;

        const registrations = await EventReg.find({ eventTitle: eventName });

        if (!registrations.length) {
            return res.status(404).json({ message: 'No registrations found for this event.' });
        }

        res.status(200).json(registrations);
    } catch (error) {
        console.error("Error fetching registrations", error);
        res.status(500).json({ message: 'Server error', error });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
