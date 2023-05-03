const express = require('express');
const Joi = require('joi');
const router = express.Router();

// simulating db
const events = [];
let eventId = 0;

// ------------------------ VALIDATE EVENT INPUT -------------------------
const eventSchema = Joi.object({
  title: Joi.string().required(),
  date: Joi.string()
    .regex(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/) // DD-MM-YYYY
    .required(),
  hour: Joi.string()
    .regex(/^[0-9]{2}:[0-9]{2}$/) // HH:mm
    .required(),
  place: Joi.string().required(),
  speakerName: Joi.string().required(),
});

// ------------------------ GET (read) all events -------------------------
router.get('/', (req, res) => {
  // no events created?
  if (events.length == 0) {
    return res.status(404).send('There are no events created.');
  }
  // send events
  res.send(events);
});

// ------------------------ GET (read) specific event -------------------------
router.get('/:id', (req, res) => {
  // find event
  const event = events.find((e) => e.id === parseInt(req.params.id));
  // doesn't find it?
  if (!event) {
    return res.status(404).send('The event does not exist.');
  }
  // send event
  res.send(event);
});

// ------------------------ POST (create) -------------------------
router.post('/', (req, res) => {
  // validate event with schema
  const { error, value } = eventSchema.validate(req.body);
  // error validating?
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { title, date, hour, place, speakerName, students = [] } = value;
  // validate date, hour & place
  const eventExists = events.some((event) => {
    return event.date === date && event.hour === hour && event.place === place;
  });
  if (eventExists) {
    return res.status(400).send('An event with the same date, hour and place already exists');
  }
  // setting up event attributes values
  const event = { id: ++eventId, title, date, hour, place, speakerName, students };
  // push event into events array
  events.push(event);
  // send event
  res.send(event);
});

// ------------------------ PUT (update) -------------------------
router.put('/:id', (req, res) => {
  // validate event with schema
  const { error, value } = eventSchema.validate(req.body);
  // error validating?
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const { title, date, hour, place, speakerName, students } = value;
  // find event
  const event = events.find((e) => e.id === parseInt(req.params.id));
  // doesn't find it?
  if (!event) {
    return res.status(404).send('The event does not exist.');
  }

  // validate date, hour & place on update
  const eventExists = events.some((event) => {
    return event.date === date && event.hour === hour && event.place === place;
  });
  if (eventExists) {
    return res.status(400).send('An event with the same date, hour and place already exists');
  }
  //set values to event attributes
  event.title = title;
  event.date = date;
  event.hour = hour;
  event.place = place;
  event.speakerName = speakerName;
  // send the event
  res.send(event);
});

// ------------------------ DELETE -------------------------
router.delete('/:id', (req, res) => {
  // find event
  const event = events.find((e) => e.id === parseInt(req.params.id));
  // doesn't find it?
  if (!event) {
    return res.status(404).send('The event with the given ID was not found');
  } else {
    // find it?
    // get event index
    const index = events.indexOf(event);
    // delete the event
    events.splice(index, 1);
    // send event (only info purposes)
    res.send(event);
  }
});
// setting up the export of events
const EVENTS = {
  router,
  events,
};

module.exports = EVENTS;
