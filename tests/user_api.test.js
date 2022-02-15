const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('../tests/test_helper');
const app = require('../app');
const api = supertest(app);

const User = require('../models/user');

beforeEach(async () => {
    await User.deleteMany({});

    let userObjects = helper.initialUsers.map((user) => new User(user));
    const promiseArray = userObjects.map((user) => user.save());
    await Promise.all(promiseArray);
});

describe('addition of a new user', () => {
    test('succeeded with valid data', async () => {
        const newUser = {
            username: 'user3',
            name: 'User 3',
            password: 'user3',
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);

        const contents = usersAtEnd.pop();
        expect(contents.username).toEqual(newUser.username);
    });

    test('if duplicate user name return status code 400', async () => {
        const newUser = {
            username: 'user1',
            name: 'User 1',
            password: 'user1',
        };
        await api.post('/api/users').send(newUser).expect(400);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
