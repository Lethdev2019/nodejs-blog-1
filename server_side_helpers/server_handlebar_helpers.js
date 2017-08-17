const moment = require('moment');
const _ = require('underscore');

exports.ifCond = function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
};

exports.checkIds = function (v1, v2, options) {
    v1 = v1.toString();
    v2 = v1.toString();
    return (v1 === v2) ? options.fn(this) : options.inverse(this);
};

exports.checkIndexOf = function (arr, v1, options) {
    if (arr) {
        if (arr.length) {
            if (arr.indexOf(v1) > -1) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
};

exports.checkContainsOf = function (arr, v1, options) {
    if (arr && arr.length) {
        v1 = v1.toString();
        let filtered = _.find(arr, function (_obj) {
            if (_obj._id.toString() === v1) {
                return _obj;
            }
        });
        return filtered ? options.fn(this) : options.inverse(this);
    }
};

exports.counter = function (start, limit, block) {
    var accum = '';
    var i;

    for (i = start; i <= limit; ++i) {
        accum = accum + block.fn(i);
    }

    return accum;
};

exports.countFullStar = function (rating) {
    var fraction = rating - Math.floor(rating);

    return fraction <= 0.5 ? Math.floor(rating) : Math.ceil(rating);
};

exports.countHalfStar = function (rating) {
    var fraction = rating - Math.floor(rating);

    return fraction <= 0.5 && fraction > 0 ? 1 : 0;
};

exports.countEmptyStar = function (rating) {
    var fraction = rating - Math.floor(rating);

    return fraction <= 0.5 && fraction > 0 ? 4 - Math.floor(rating) : 5 - Math.ceil(rating);
};

exports.truncateText = function (text, max) {
    if (text) {
        max = Number(max);
        if (text.length > max)
            return text.substring(0, max) + '...';
        else
            return text;
    }
    else {
        return '';
    }
};

exports.pagination = function (total, current, limit) {
    var start;
    var end;
    var currentPage = Number(current);
    total = parseInt((total / limit), 10);

    if (total !== 0) {

    }
};

exports.checkPagination = function (pageNo, total, current) {
    var id = parseInt(current / 10);
    if (id !== 1) {
        id = id + 1
    }
    id = id * 10;
    if (Number(pageNo) > id) {
        return 'hide js_page_next';
    }
    return 'js_page_current';
};

exports.checkPaginationPrev = function (current) {
    if (current < 10) {
        return 'in_active';
    }
    return '';
};

exports.checkPaginationNext = function (total, current) {
    var id = parseInt(current / 10);
    if (id !== 1) {
        id = id + 1
    } else {
        id = 1;
    }
    id = id * 10;
    if (id > total) {
        return 'in_active';
    } else {
        return '';
    }
};

exports.plus = function (num1, num2) {
    num1 = parseInt(num1);
    num2 = parseInt(num2);

    return num1 + num2;
};

exports.cleanString = function (text) {
    if (text) {
        text = text.toString();
        text = text.split(' ');
        text = text.join('_').toLocaleLowerCase();
    }
    return text;
};

exports.removeSpaceAndLinkByHyphen = function (text) {
    if (text) {
        text = text.toString();
        text = text.split(' ');
        text = text.join('-').toLocaleLowerCase();
    }
    return text;
};


exports.printObj = function (obj) {
    console.log(obj);

    return '';
};

exports.checkQuery = function (query, val, options) {
    if (query) {
        if (query.hasOwnProperty('category')) {
            if (query.category === val) {
                return options.fn(this);
            }
        }
    }

    return options.inverse(this);
};

exports.inc = function (value, options) {
    return parseInt(value) + 1;
};

exports.cleanStringForUrl = function (_str) {
    if (_str) {
        _str = _str.replace(/\s/g, '-');
    }
    return (_str);
};

exports.json = function (context) {
    return JSON.stringify(context);
};

exports.checkIndexOf = function (arr, v1, options) {
    if (arr && arr.length && v1) {
        if (arr.indexOf(v1) > -1) {
            return options.fn(this);
        }
        return options.inverse(this);
    } else {
        return options.inverse(this);
    }
};

exports.partial = function (name) {
    return name;
};

exports.formatDate = function (dateString, format) {
    if (dateString && format) {
        return moment(dateString).format(format)
    } else {
        return ''
    }
};