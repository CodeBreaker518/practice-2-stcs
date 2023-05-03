const express = require('express');
const Joi = require('joi');

// Creating a router instance
const router = express.Router();

// Importing students and events arrays from their respective routes
const studentsRoute = require('./students');
const { students } = studentsRoute;

const eventsRoute = require('./events');
const { events } = eventsRoute;

// ---------------------- VALIDATE STUDENT IN EVENT --------------------
function validateStudentInEvent(studentInEvent) {
  // define a Joi schema to validate the request body
  const schema = Joi.object({
    eventId: Joi.number().integer().required(),
    studentId: Joi.number().integer().required(),
  });
  return schema.validate(studentInEvent);
}

// ------------------------ GET (read) -------------------------
router.get('/:eventId', (req, res) => {
  // Find the event with the given eventId
  const event = events.find((e) => e.id === parseInt(req.params.eventId));
  // doesn't find it?
  if (!event) {
    return res.status(404).send('The event with the given ID was not found');
  }
  // Map the student ids in the event to their respective student objects
  const studentsInEvent = event.students.map((studentId) => students.find((s) => s.id === studentId));
  // Return the array of students registered in the event
  res.send(studentsInEvent);
});

// ------------------------ POST (create) -------------------------
router.post('/', (req, res) => {
  // validate with schema
  const { error } = validateStudentInEvent(req.body);
  // error validating?
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // parse the event and student IDs from the request body
  const eventId = parseInt(req.body.eventId);
  const studentId = parseInt(req.body.studentId);
  // find the event with the given ID
  const event = events.find((e) => e.id === eventId);
  // doesnt find it?
  if (!event) {
    return res.status(404).send('The event with the given ID was not found');
  }
  // find the student with the given ID
  const student = students.find((s) => s.id === studentId);
  // doesn't find it?
  if (!student) {
    return res.status(404).send('The student with the given ID was not found');
  }
  // check if the student is already registered in the event
  if (event.students.includes(studentId)) {
    return res.status(400).send('The student is already registered in the event');
  }
  // add the student to the event and send the student ID in the response
  event.students.push(studentId);
  res.send(studentId.toString());
});

// ------------------------ DELETE -------------------------
router.delete('/', (req, res) => {
  // validate with schema
  const { error } = validateStudentInEvent(req.body);
  // error validating?
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // parse the event and student IDs from the request body
  const eventId = parseInt(req.body.eventId);
  const studentId = parseInt(req.body.studentId);

  // find the event with the given ID
  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return res.status(404).send('The event with the given ID was not found');
  }
  // find the index of the student in the event's student list
  const studentIndex = event.students.findIndex((id) => id === studentId);
  if (studentIndex === -1) {
    return res.status(404).send('The student is not registered in the event');
  }
  // remove the student from the event and send the student ID in the response
  event.students.splice(studentIndex, 1);
  res.send(studentId.toString());
});

module.exports = router;
