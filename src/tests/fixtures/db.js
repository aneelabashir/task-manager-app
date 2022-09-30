const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../model/user')

const userOneId = new mongoose.Types.ObjectId;
const oneUser = {
    _id: userOneId,
    name: 'nabeela',
    email: 'nabeela@example.com',
    password: '12345OO@@',
    age: 33,
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
        }
    ]
}

const databaseCOnfig = async () => {
    await User.deleteMany();
    await new User(oneUser).save();
}

module.exports = {
    userOneId,
    oneUser,
    databaseCOnfig

}