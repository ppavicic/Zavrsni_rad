const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');
const db = require('./db')
var cors = require('cors')

const loginRouter = require('./routes/loginTeacher');
const teacherProfileRouter = require('./routes/teacherProfile');
const loginStudentRouter = require('./routes/loginStudent');
const exerciseRouter = require('./routes/exercise');

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/loginTeacher', loginRouter);
app.use('/teacherProfile', teacherProfileRouter);
app.use('/loginStudent', loginStudentRouter);
app.use('/exercise', exerciseRouter);

const PORT = 8000
app.listen(PORT);