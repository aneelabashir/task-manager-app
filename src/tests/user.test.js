const request = require('supertest');
const app = require('../app');
const User = require('../model/user')

const { userOneId, oneUser, databaseCOnfig } = require('../tests/fixtures/db')

beforeEach(databaseCOnfig);

test('Should create user in the db', async () => {

    const respone = await request(app)
        .post('/users')
        .send({
            name: 'Aneela',
            email: 'aneela@example.com',
            password: '12345OO@@',
            age: 27
        })
        .expect(201);

    //dataa was stored in the db properly
    const user = await User.findById(respone.body.user._id);
    expect(user).not.toBeNull();

    //correct response
    expect(respone.body).toMatchObject({
        user: {
            name: 'Aneela',
            email: 'aneela@example.com'
        },
        token: user.tokens[0].token
    })
})

test('Should login an exciting user', async () => {

    const response = await request(app).post('/users/login').send({
        email: oneUser.email,
        password: oneUser.password
    }).expect(200);
    // assersation for checking if the data is corretly saved in the database
    const user = await User.findById(oneUser);

    expect(user.tokens[1].token).toBe(response.body.token);
})

test('Should not login a non existing user', async () => {

    await request(app).post('/users/login').send({
        email: 'abc@example.com',
        password: '33444444'
    }).expect(400)
})

test('Should return user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${oneUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not return profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delelte the exisitng user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${oneUser.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(oneUser._id);
    expect(user).toBeNull()
})


test('Shpuld not the un authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
})

test('Should not upload avatar pic', async () => {
    await request(app)
        .post('/users/me/avatar')
        //.set('Authorization',`Bearer ${oneUser.tokens[0].token}`)
        //.attach('avatar','../tests/fixtures/avatar.png')
        .expect(401)
})


