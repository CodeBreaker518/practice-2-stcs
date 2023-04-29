const express = require('express')
const Joi = require('joi')
const router = express.Router()

// simulating db
const students = []
// importing events array
const eventsRoute = require('./events')
const { events } = eventsRoute

// ------------------------ VALIDATE STUDENT INPUT -------------------------
const validateStudent = (student) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    career: Joi.string().uppercase().required(),
  })
  return schema.validate(student)
}

// ----------------------- GET (read) all students ----------------------------
router.get('/', (req, res) => {
  // no students created?
  if (students.length == 0) {
    return res.status(404).send('There are no students created')
  }
  // send students
  res.send(students)
})

// ------------------------ GET (read) specific student -------------------------
router.get('/:id', (req, res) => {
  // find student
  const student = students.find((s) => s.id === parseInt(req.params.id))
  // doesn't find it?
  if (!student) {
    return res.status(404).send('The student with the given ID was not found')
  } else {
    // send student
    res.send(student)
  }
})

// ------------------------ POST (create) -------------------------
router.post('/', (req, res) => {
  // validate student with schema
  const { error } = validateStudent(req.body)
  // error validating?
  if (error) {
    return res.status(400).send(error.details[0].message)
  } else {
    // creating student
    const student = {
      id: students.length + 1,
      name: req.body.name,
      email: req.body.email,
      career: req.body.career,
    }
    // validate email
    if (student.email && students.find((s) => s.email === student.email && s.id !== student.id)) {
      return res.status(400).send('A student with the same email already exists')
    }
    // push student into the students array
    students.push(student)
    // send student
    res.send(student)
  }
})

// ------------------------ PUT (update) -------------------------
router.put('/:id', (req, res) => {
  // find student
  const student = students.find((s) => s.id === parseInt(req.params.id))
  // not found?
  if (!student) {
    return res.status(404).send('The student with the given ID was not found')
  }
  // validate student with schema
  const { error } = validateStudent(req.body)
  if (error) {
    return res.status(400).send(error.details[0].message)
  }
  // validate email
  if (req.body.email && students.find((s) => s.email === req.body.email && s.id !== student.id)) {
    return res.status(400).send('A student with the same email already exists')
  }
  // set values to student
  student.name = req.body.name
  student.email = req.body.email
  //send student
  res.send(student)
})

// ------------------------ DELETE -------------------------
router.delete('/:id', (req, res) => {
  // find student
  const student = students.find((s) => s.id === parseInt(req.params.id))
  // not found?
  if (!student) {
    return res.status(404).send('The student with the given ID was not found')
  }

  // delete the student from every event he was registered
  events.forEach((event) => {
    event.students = event.students.filter((s) => s !== student.id)
  })

  // find student index
  const index = students.indexOf(student)
  // delete student
  students.splice(index, 1)
  // send student (only info purposes)
  res.send(student)
})

// setting up the export of students
const STUDENTS = {
  router,
  students,
}

module.exports = STUDENTS
