const mongoose = require('mongoose');
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true
})


// const ri = new user({
//     name : 'Zarina ',
//     password: '12345678',
//     email: 'Zarina@gmail.com',
//     age : 55
// })
// ri.save().then( (result) => {
// console.log(result)
// }).then((error) => {
//     console.log('Error! ',error);
// })
// const myTask = new task({
//     describe: 'Recharge Room activities!  ',  
// })
// myTask.save().then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// })