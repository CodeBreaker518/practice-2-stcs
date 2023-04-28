const students = require('./routes/students')
const events = require('./routes/events')
const studentsInEvents = require('./routes/studentsInEvents')
const express = require('express')
const Joi = require('joi')
const app = express()

app.use(express.json())
app.use(express.static(`public`))
app.use(express.urlencoded({ extended: true }))

app.use('/api/students', students.router)
app.use('/api/events', events.router)
app.use('/api/students-in-events', studentsInEvents)

const port = process.env.PORT || 8888

app.listen(port, () => console.log(`Listening into port ${port}`))
