var request = require('request');

var getContent = function (req, res, callback) {

    request(req.url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(JSON.parse(response.body));
            callback();
        } else {
            res.send(500);
            callback()
        }
    });
};

var postContent = function (req, callback) {
    console.log(req);
    request.post(req, function(error, response, body){
        console.log(body);
        callback(body);
    });
};

exports.getContent = getContent;
exports.postContent = postContent;
