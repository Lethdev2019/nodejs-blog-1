'use strict';

const gm = require('gm').subClass({imageMagick: true});
const url = require('url');
const path = require('path');
require('gm-base64');

module.exports = function (router) {
    router.get('/cdn/blog-images/:filePath*', function (req, res, next) {
        let _url = url.parse(req.url).pathname;
        _url = _url.replace('/cdn/blog-images/', '/img/blog-images/');
        _url = _url.replace(/^\//, '');
        let _path = path.resolve(__dirname, '../public');
        _url = _path + '/' + _url;
        let url_parts = url.parse(req.url, true);
        let query = url_parts.query;
        let toDataUri = true;
        let _file_type;

        gm(_url)
            .format(function (err, val) {
                _file_type = val;
            })
            .size(function (err, value) {
                if (value) {
                    this.drawText(value.width - 100, value.height - 50, "NodeJsBlog");
                }
                if (query.h || query.w) {
                    this.resize(query.h, query.w);
                }
                this.stream(_file_type, function (err, stdout) {
                    let buf = '';
                    if (err) {
                        return callback(err);
                    }
                    stdout
                        .on('data', function (data) {
                            buf += data.toString('binary');
                        })
                        .on('end', function () {
                            let buffer = new Buffer(buf, 'binary');
                            let result = buffer.toString('base64');
                            if (toDataUri) {
                                result = "data:image/" + _file_type + ";base64," + result;
                            }
                            res.send(result);
                        });
                });
            })
    });
};