'use strict';

const gm = require('gm').subClass({imageMagick: true});
const url = require('url');
const path = require('path');

module.exports = function (router) {
    router.get('/cdn/blog-images/:filePath*', function (req, res, next) {
        let _url = url.parse(req.url).pathname;
        let _file_type;
        _url = _url.replace('/cdn/blog-images/', '/img/blog-images/');
        _url = _url.replace(/^\//, '');
        let _path = path.resolve(__dirname, '../public');
        _url = _path + '/' + _url;
        let url_parts = url.parse(req.url, true);
        let query = url_parts.query;
        gm(_url)
            .format(function (err, val) {
                _file_type = val;
            })
            .size({bufferStream: true}, function (err, value) {
                if (value) {
                    this.drawText(value.width - 100, value.height - 50, "NodeJsBlog");
                }
                if (query.h || query.w) {
                    this.resize(query.h, query.w);
                }
                this.toBuffer(_file_type, function (err, buffer) {
                    if (err) {
                        res.status(404);
                        res.end();
                    } else {
                        if (value) {
                            res.writeHead(200, {'Content-Type': _file_type || ''});
                        }
                        res.end(buffer);
                    }
                });
            });
    });
};