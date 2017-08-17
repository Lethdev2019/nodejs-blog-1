'use strict';

const path = require('path');
const fs = require('fs');
const Blog = require('../models/blog');
const crypto = require('crypto');

// Decoding base-64 image
function decodeBase64Image(dataString) {
    let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let response = {};
    if (matches.length !== 3) {
        return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    return response;
}

function uploadBlogImage(data64String, cb) {
    try {
        let _path = path.resolve(__dirname, '../public');

        // Regular expression for image type:
        // This regular image extracts the "jpeg" from "image/jpeg"
        let imageTypeRegularExpression = /\/(.*?)$/;

        // Generate random string
        let seed = crypto.randomBytes(20);
        let uniqueSHA1String = crypto
            .createHash('sha1')
            .update(seed)
            .digest('hex');

        // let base64Data = data64String;

        let imageBuffer = decodeBase64Image(data64String);
        let userUploadedFeedMessagesLocation = _path + '/img/blog-images/';

        let uniqueRandomImageName = 'image-' + uniqueSHA1String;
        // This letiable is actually an array which has 5 values,
        // The [1] value is the real image extension
        let imageTypeDetected = imageBuffer
            .type
            .match(imageTypeRegularExpression);

        let userUploadedImagePath = userUploadedFeedMessagesLocation +
            uniqueRandomImageName +
            '.' +
            imageTypeDetected[1];

        // Save decoded binary image to disk
        try {
            fs.writeFile(userUploadedImagePath, imageBuffer.data,
                function () {
                    console.log('DEBUG - feed:message: Saved to disk image attached by user:', userUploadedImagePath);
                    cb('/cdn/blog-images/' + uniqueRandomImageName + '.' + imageTypeDetected[1])
                });
        }
        catch (error) {
            console.log('ERROR:', error);
            cb(null)
        }

    }
    catch (error) {
        console.log('ERROR:', error);
        cb(null)
    }
}

module.exports = function (router) {
    router.post('/blog/upload', function (req, res) {
        Blog.find({url: req.body.url}, function (err, _blog_doc) {
            console.log(err, _blog_doc);
            if (!_blog_doc.length) {
                let _data = {
                    url: req.body.url,
                    title: req.body.title,
                    desc: req.body.desc,
                    small_desc: req.body.small_desc,
                    cover_img: req.body.cover_img,
                    tags: req.body.tags,
                    meta_keywords: req.body.meta_keywords,
                };

                Blog.create(_data, function (err, _blog_doc) {
                    if (err) {
                        console.log(err);
                        res.json({err: true, msg: err.message, data: null});
                        return;
                    }
                    res.json({err: false, msg: 'New blog created successfully!', data: _blog_doc})
                });
            } else {
                res.json({
                    err: true,
                    msg: 'Url already taken',
                    data: null
                })
            }
        });
    });

    router.post('/blog/image-upload', function (req, res) {
        uploadBlogImage(req.body.src, function (_image_path) {
            if (_image_path) {
                res.json({
                    err: false,
                    msg: 'Image uploaded successfully!',
                    data: {path: _image_path}
                })
            } else {
                res.json({
                    err: true,
                    msg: 'Image not uploaded',
                    data: null
                })
            }
        })
    });

    router.get('/fetch/blogs', function (req, res) {
        Blog.find({}, function (err, _blog_doc) {
            if (!err) {
                res.json({
                    err: false,
                    msg: 'Document found',
                    data: _blog_doc
                })
            } else {
                console.log(err);
                res.json({
                    err: true,
                    msg: 'Document not found',
                    data: null
                })
            }
        })
    });

    router.get('/fetch/blog/:id', function (req, res) {
        Blog.findOne({_id: req.params.id}, function (err, _blog_doc) {
            if (!err) {
                res.json({
                    err: false,
                    msg: 'Document found',
                    data: _blog_doc
                })
            } else {
                console.log(err);
                res.json({
                    err: true,
                    msg: 'Document not found',
                    data: null
                })
            }
        })
    });

    router.get('/fetch/blog/url/:url', function (req, res) {
        Blog.findOne({url: req.params.url}, function (err, _blog_doc) {
            if (!err) {
                res.json({
                    err: false,
                    msg: 'Document found',
                    data: _blog_doc
                })
            } else {
                console.log(err);
                res.json({
                    err: true,
                    msg: 'Document not found',
                    data: null
                })
            }
        })
    });

    router.post('/update/blog/:id', function (req, res) {
        Blog.update({_id: req.params.id}, req.body, {overwrite: true}, function (err, data) {
            if (err) {
                console.log(err);
                res.json({err: true, msg: err.message});
                return;
            }
            res.json({err: false, data: data})
        });
    });
};