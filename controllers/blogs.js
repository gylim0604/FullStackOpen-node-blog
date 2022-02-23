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
    const user = request.user;
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
    const user = request.user;
    const blog = await Blog.findById(request.params.id);
    console.log(blog.user.toString());
    
    console.log(user.id.toString());
    if (blog.user.toString() === user.id.toString()) {
        console.log('removing blog');
        blog.remove();
        // TODO: Update blog removal
        user.blogs = user.blogs.filter((el) => el.id !== request.params.id);
        await user.save();
        response.status(204).end();
    } else {
        response
            .status(400)
            .json({ status: 'Error', msg: 'Incorrect Permission' });
    }
});
blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body;
    const blog = {
        likes: body.likes,
    };

    Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        .then((updatedBlog) => {
            response.status(201).json(updatedBlog);
        })
        .catch((error) => next(error));
});

module.exports = blogsRouter;
