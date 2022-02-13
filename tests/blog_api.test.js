const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('../tests/test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
    await Blog.deleteMany({});

    let blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
});
test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('blog contains unique identifier(id)', async () => {
    const response = await api.get('/api/blogs');
    const first = response.body[0];
    expect(first.id).toBeDefined();
});

describe('addition of a new blog', () => {
    test('succedded with valid data', async () => {
        const newBlog = {
            title: 'Testing Content',
            author: 'John Doe',
            url: 'http://www.placeholder.com',
            likes: 1,
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogAtEnd = await helper.blogsInDb();
        expect(blogAtEnd).toHaveLength(helper.initialBlogs.length + 1);

        const contents = blogAtEnd.pop();
        expect(contents).toMatchObject(newBlog);
    });
    test('if like property is missing, will default to 0', async () => {
        const newBlog = {
            title: 'Testing Content',
            author: 'John Doe',
            url: 'http://www.placeholder.com',
        };

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const blogAtEnd = await helper.blogsInDb();
        const contents = blogAtEnd.pop();
        expect(contents.likes).toEqual(0);
    });

    test('if title and url properties missing, will return 400', async () => {
        const newBlog = {
            author: 'John Doe',
        };

        await api.post('/api/blogs').send(newBlog).expect(400);
    });
});

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];
        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

        const blogsAtEnd = await helper.blogsInDb();

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
        const titles = blogsAtEnd.map((blog) => blog.title);
        expect(titles).not.toContain(blogToDelete.title);
    });
});

describe('updating a blog', () => {
    test('updates the number of like for a post by 1', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogAtStart = blogsAtStart[0];
        const editBlog = { likes: blogAtStart.likes + 1 };

        await api
            .put(`/api/blogs/${blogAtStart.id}`)
            .send(editBlog)
            .expect(204);

        const blogsAtEnd = await helper.blogsInDb();
        const updatedBlog = blogsAtEnd[0];
        expect(updatedBlog.likes).toEqual(blogAtStart.likes + 1);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
