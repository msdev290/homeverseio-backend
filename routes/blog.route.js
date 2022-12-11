const express = require('express');
const { ADD_BLOG, GET_VIDEO_BLOGS } = require('../configs/app-config');
const { addBlog, getVideoBlogs } = require('../controllers/blog.controller');


const router = express.Router();

router.post(ADD_BLOG, addBlog)
router.post(GET_VIDEO_BLOGS, getVideoBlogs)

module.exports = router;