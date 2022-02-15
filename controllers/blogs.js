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

blogsRouter.post('/', async (request, response) => {
    // const blog = new Blog(request.body);
    const body = request.body;
    const user = (await User.find({})).pop();
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
