var qs = require('querystring');

module.exports = {
    makeAjaxRequest: function (url, query, method, dataType, data, callback) {
        if (!url) {
            return false;
        }

        //adding query with url
        url = qs.stringify(query) ? (url + '?' + qs.stringify(query)) : url;

        var reqObj = {
            url: url,
            method: method,
            dataType: dataType,
            data: data,
            success: function (res) {
                callback(res);
            },
            error: function (err) {
                callback(err);
            }
        };

        //Make ajax request with given details
        $.ajax(reqObj);
    }
};