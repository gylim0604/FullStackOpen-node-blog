var _ = require('lodash');

const dummy = (blogs) => {
    return 1;
};
const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return (sum += blog.likes);
    };
    return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
    const reducer = (max, blog) => {
        return (max = max.likes > blog.likes ? max : blog);
    };
    const favourite = blogs.reduce(reducer, { likes: -1 });
    return {
        title: favourite.title,
        author: favourite.author,
        likes: favourite.likes,
    };
};

const mostBlogs = (blogs) => {
    const reducer = (arr, blog) => {
        // check if blog author is in array
        let index = arr.findIndex((el) => el.author === blog.author);
        if (index === -1) {
            return [
                ...arr,
                {
                    author: blog.author,
                    blogs: 1,
                },
            ];
        } else {
            let temp = arr[index];
            arr.splice(index, 1, {
                author: temp.author,
                blogs: temp.blogs + 1,
            });
            return arr;
        }
    };

    let blogSum = blogs.reduce(reducer, []);
    return blogSum.sort((first, second) => {
        return first.blogs >= second.blogs ? -1 : 1;
    })[0];
};

const mostLikes = (blogs) => {
    const reducer = (arr, blog) => {
        // check if blog author is in array
        let index = arr.findIndex((el) => el.author === blog.author);
        if (index === -1) {
            return [
                ...arr,
                {
                    author: blog.author,
                    likes: blog.likes,
                },
            ];
        } else {
            let temp = arr[index];
            arr.splice(index, 1, {
                author: temp.author,
                likes: (temp.likes += blog.likes),
            });
            return arr;
        }
    };

    let blogSum = blogs.reduce(reducer, []);
    return blogSum.sort((first, second) => {
        return first.likes >= second.likes ? -1 : 1;
    })[0];
};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
};
