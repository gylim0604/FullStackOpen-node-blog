const jwt = require('jsonwebtoken');
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1,
    });
    response.json(blogs);
});

const getTokenFrom = (request) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};

blogsRouter.post('/', async (request, response) => {
    const body = request.body;
    const token = request.token;
    const decodedToken = jwt.verify(token, process.env.SECRET);
    // if (!token || !decodedToken.id) {
    //     return response.status(401).json({ error: 'token missing or invalid' });
    // }
    const user = await User.findById(decodedToken.id);
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog.toJSON());
});

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
});
blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body;
    const blog = {
        likes: body.likes,
    };

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then((updatedBlog) => {
            response.status(204).json(updatedBlog);
        })
        .catch((error) => next(error));
});

module.exports = blogsRouter;
