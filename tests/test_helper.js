const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 12,
        __v: 0,
    },
    {
        title: 'A different title',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 12,
        __v: 0,
    },
    {
        title: 'Das Kommuist Manifesto',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 12,
        __v: 0,
    },
    {
        title: 'The art of war~',
        author: 'Someone Else',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 12,
        __v: 0,
    },
];

const blogsInDb = async () => {
    const blogs = await Blog.find();
    return blogs.map((blog) => blog.toJSON());
};

const initialUsers = [
    {
        username: 'user1',
        name: 'User 1',
        password: 'user1',
    },
    {
        username: 'user2',
        name: 'User 2',
        password: 'user2',
    },
];

const usersInDb = async () => {
    const users = await User.find();
    return users.map((user) => user.toJSON());
};
module.exports = {
    initialBlogs,
    initialUsers,
    blogsInDb,
    usersInDb,
};
