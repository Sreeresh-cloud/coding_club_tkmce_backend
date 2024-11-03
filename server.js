const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Event = require("./models/Events"); // Import the Event model
const multer = require("multer");
const EventReg =require("./models/EventReg")
require('dotenv').config();




// Create an instance of Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

const storage = multer.memoryStorage(); // Store files in memory for simplicity
const upload = multer({ storage: storage });

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true,tlsAllowInvalidCertificates: true})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a simple route
app.get('/', (req, res) => {
    res.send('Welcome to the  Backend!');
});

app.post("/events", upload.single("image"), async (req, res) => {
    const { name, description, date, venue, mode } = req.body;

    let eventImage;
    // Access the uploaded file (if any)
    if (req.file) {
        console.log("File received:", req.file);
        // For simplicity, let's assume you want to save the image as a base64 string
        eventImage = req.file.buffer.toString("base64");
        console.log("No file received");

    }

    // Create a new event instance
    const newEvent = new Event({
        eventName: name,
        eventDescription: description,
        eventDate: date,
        eventVenue: venue,
        eventImage: eventImage, // Save the base64 string or a URL/path if you save it elsewhere
        eventMode: mode,
    });

    try {
        // Save the event to the database
        await newEvent.save();
        res.status(201).json({ message: "Event added successfully!" });
    } catch (error) {
        console.error("Error saving event:", error);
        res.status(500).json({ message: "Error saving event", error: error.message });
    }
});

app.get('/events', async (req, res) => {
    try {
        const events = await Event.find(); // Fetch all events
        res.status(200).json(events); // Send the events back to the client
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

        // Fetch registrations where the eventTitle matches the eventId
        const registrations = await EventReg.find({ eventTitle: eventName });

        // Check if registrations were found
        if (!registrations.length) {
            return res.status(404).json({ message: 'No registrations found for this event.' });
        }

        // Respond with the registrations
        res.status(200).json(registrations);
    } catch (error) {
        console.error("Error fetching registrations", error);
        res.status(500).json({ message: 'Server error', error });
    }
});



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
