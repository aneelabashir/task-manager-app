const express = require('express')
const app = express();

require('./db/mongoose.js');

const userRouter = require('./router/user');
const taskRouter = require('./router/task');


app.use(express.json())
app.use(userRouter);
app.use(taskRouter);


module.exports = app;