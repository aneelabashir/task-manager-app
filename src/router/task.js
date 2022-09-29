const express = require('express');
const router = express.Router();

const Task = require('../model/task');
const auth = require('../middleware/auth')

router.post('/tasks',auth , async (req, res) => {
    try {
        console.log(req.user);
        const task = new Task({
            ...req.body,
             owner: req.user._id
            });
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(400).send('something went');
    }
})



router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const completed = req.query.completed ? req.query.completed : false;
    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }

    try {
        const tasks = await Task.find({owner: req.user.id, completed}).sort({createdAt:-1});
        // await req.user.populate({
        //     path:'tasks',
        //     match
        // }).execPopulate();
        //res.send(req.user.tasks);
        res.send(tasks)
    } catch (e) {
        res.status(500);
    }
})

router.get('/tasks/:id',auth, async (req, res) => {
    try {
        const _id = req.params.id;
       // const task = await Task.findById(_id);
       const task = await Task.findOne({_id,owner: req.user._id})
        if (!task) {
            return res.status(400).send('No Task Found!');
        }
        res.send(task);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.patch('/tasks/:id',auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['describe', 'completed'];
    const isValidUpdate = updates.every(update => allowedUpdates.includes(update));
    if(!isValidUpdate){
        return res.status(400).send('Error Invalid update!');
    }
    try {
        const _id = req.params.id;
        //const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        //const task = await Task.findById(_id);
        console.log(req.user._id);
        const task = await task.findOne({_id:req.params.id, owner: req.user._id});
        console.log(task)
        if (!task) {
            return res.status(400).send('No Task Found!');
        }
        updates.forEach(update => task[update] = req.body[task]);
        const updatedTask = await task.save();
        res.send(updatedTask);
    } catch (e) {
        res.status(400).send(e);
    }
})
router.delete('/tasks/:id' ,auth, async (req,res) => {
    try{
        //const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(400).send('No task found to delete');
        }
        res.send(task);
    }catch(e){
        res.status(400).send(e);
    }
})


module.exports = router;