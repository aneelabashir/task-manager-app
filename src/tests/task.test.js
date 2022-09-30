const request = require('supertest');
const app = require('../app');
const User = require('../model/user')
const Task = require('../model/task');
const { userOneId, oneUser, databaseCOnfig } = require('../tests/fixtures/db')

beforeEach(databaseCOnfig);


test('Shoud create a task', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${oneUser.tokens[0].token}`)
        .send({
            describe: 'complete recording!',
            completed: false
        })
        .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
})