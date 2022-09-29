const express = require('express');
const multer = require('multer');
const sharp = require('sharp')
const router = new express.Router();
const User = require('../model/user');
const auth = require('../middleware/auth')

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image file'));
        }
        cb(undefined, true);
    }
});



router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateJwtToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findBycredentials(req.body.email, req.body.password);
        const token = await user.generateJwtToken();
        res.send({ user, token });
        // res.send(user);
    } catch (e) {
        res.status(400).send(e)

    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        })
        await req.user.save();
        res.send('Successfully Loged out!!');

    } catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('Successfully Loged out from All!!');

    } catch (e) {
        res.status(500).send();
    }
})


router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
})
// router.get('/users/:id', async (req, res) => {
//     try {
//         const _id = req.params.id;
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(400).send('No user found!');
//         }
//         res.send(user);

//     } catch (e) {
//         res.status(400).send('Error occured', e)
//     }
// })

router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        return res.status(400).send('Error! invalid update.')
    }
    try {
        // const _id = req.params.id;
        // const body = req.body;
        // const user = await User.findById(_id);

        // //const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        // if (!user) {
        //     return res.status(400).send('No user');
        // }
        updates.forEach(update => req.user[update] = req.body[update]);
        const userUpdated = await req.user.save();
        res.send(userUpdated);

    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        //const user = await User.findByIdAndDelete(req.user._id);
        await req.user.remove();
        // if (!user) {
        //     return res.status(400).send('No user found to delete');
        // }
        res.send();
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ Error: error.message });

})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router;
