'use strict';

const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

router.get('/', function (req, res) {
    Blog.find({}, function (err, main_doc) {
        res.render('home', {blogs: main_doc});
    });
});

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.get('/forgot-password', function (req, res) {
    res.render('forgot-password');
});

router.get('/blogs', function (req, res) {
    Blog.find({}, function (err, main_doc) {
        res.render('view_blogs', {data: main_doc});
    })
});
router.get('/blog/:url', function (req, res) {
    Blog.findOne({url: req.params.url}, function (err, main_doc) {
        res.render('blog-details', {data: main_doc});
    })
});

router.get('/add/blog', function (req, res) {
    res.render('blog_editor');
});

router.get('/blog-details/:id', function (req, res) {
    Blog.findOne({_id: req.params.id}, function (err, _blog_doc) {
        if (!err) {
            res.render('blog_details', {data: _blog_doc});
        } else {
            console.log(err);
            res.render('404');
        }
    })
});

router.get('/edit/blog/:id', function (req, res) {
    Blog.findOne({_id: req.params.id}, function (err, _blog_doc) {
        if (!err) {
            res.render('blog_editor', {data: _blog_doc});
        } else {
            console.log(err);
            res.render('404');
        }
    })
});

require('./cdn')(router);


module.exports = router;