let _ = require('underscore');

exports.validateResponse = function(response) {
    return response && response.body ? _.isObject(response.body) ? response.body : JSON.parse(response.body) : null;
};
