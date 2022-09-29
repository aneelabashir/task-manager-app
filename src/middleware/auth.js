const jwt = require('jsonwebtoken');
const User = require('../model/user')

const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        //console.log(decode);
        const user = await User.findOne({_id:decode._id, 'tokens.token':token});
        if(!user){
            throw new Error()
        };
        req.token = token;
        req.user = user;
        //console.log(user);
        next();
    }catch(e){
        res.status(401).send('Unauthorize User!');
    }
}

module.exports = auth