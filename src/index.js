const express = require('express')
const app = express();

require('./db/mongoose.js');

const userRouter = require('./router/user');
const taskRouter = require('./router/task');
const port = process.env.PORT

app.use(express.json())
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server is up on port ', port);
})