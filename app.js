// Importing routes for students, events, and students in events from their respective files
const students = require('./routes/students');
const events = require('./routes/events');
const studentsInEvents = require('./routes/studentsInEvents');

// Creating a Joi instance for input validation
const Joi = require('joi');

// Creating an Express instance
const express = require('express');
const app = express();

// Parsing incoming requests with JSON payloads
app.use(express.json());

// Serving static files from the 'public' directory
app.use(express.static(`public`));

// Parsing URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Mounting the student, event, and student-in-event routes
app.use('/api/students', students.router);
app.use('/api/events', events.router);
app.use('/api/students-in-events', studentsInEvents);

// Setting the port number
const port = process.env.PORT || 8888;

// Starting the server
app.listen(port, () => console.log(`Listening on port ${port}`));
