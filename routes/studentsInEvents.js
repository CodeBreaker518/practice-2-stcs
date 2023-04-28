const express = require('express')
const Joi = require('joi')
const router = express.Router()

const studentsRoute = require('./students')
const { students } = studentsRoute

const eventsRoute = require('./events')
const { events } = eventsRoute

// ------------------------ GET (read) -------------------------
router.get('/:eventId', (req, res) => {
  const event = events.find((e) => e.id === parseInt(req.params.eventId))
  if (!event) return res.status(404).send('The event with the given ID was not found')
  const studentsInEvent = event.students.map((studentId) => students.find((s) => s.id === studentId))
  res.send(studentsInEvent)
})

// ------------------------ POST (create) -------------------------
router.post('/', (req, res) => {
  const { error } = validateStudentInEvent(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const eventId = parseInt(req.body.eventId)
  const studentId = parseInt(req.body.studentId)

  const event = events.find((e) => e.id === eventId)
  if (!event) return res.status(404).send('The event with the given ID was not found')

  const student = students.find((s) => s.id === studentId)
  if (!student) return res.status(404).send('The student with the given ID was not found')

  if (event.students.includes(studentId)) {
    return res.status(400).send('The student is already registered in the event')
  }

  event.students.push(studentId)
  res.send(studentId.toString())
})

// ------------------------ DELETE -------------------------
router.delete('/', (req, res) => {
  const { error } = validateStudentInEvent(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const eventId = parseInt(req.body.eventId)
  const studentId = parseInt(req.body.studentId)

  const event = events.find((e) => e.id === eventId)
  if (!event) return res.status(404).send('The event with the given ID was not found')

  const studentIndex = event.students.findIndex((id) => id === studentId)
  if (studentIndex === -1) {
    return res.status(404).send('The student is not registered in the event')
  }

  event.students.splice(studentIndex, 1)
  res.send(studentId.toString())
})

function validateStudentInEvent(studentInEvent) {
  const schema = Joi.object({
    eventId: Joi.number().integer().required(),
    studentId: Joi.number().integer().required(),
  })
  return schema.validate(studentInEvent)
}

module.exports = router
