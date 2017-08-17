var moment = require('moment');

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
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
});

Handlebars.registerHelper('checkIndexOf', function (arr, v1, options) {
    if (arr) {
        if (arr.length) {
            if (arr.indexOf(v1) > -1) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
});

Handlebars.registerHelper('counter', function (start, limit, block) {
    var accum = '';
    var i;

    for (i = start; i <= limit; ++i) {
        accum = accum + block.fn(i);
    }

    return accum;
});

Handlebars.registerHelper('countFullStar', function (rating) {
    rating = parseFloat(rating);
    var fraction = rating - Math.floor(rating);

    return fraction <= 0.5 ? Math.floor(rating) : Math.ceil(rating);
});

Handlebars.registerHelper('countHalfStar', function (rating) {
    rating = parseFloat(rating);
    var fraction = rating - Math.floor(rating);

    return fraction <= 0.5 && fraction > 0 ? 1 : 0;
});

Handlebars.registerHelper('countEmptyStar', function (rating) {
    var fraction = rating - Math.floor(rating);

    return fraction <= 0.5 && fraction > 0 ? 4 - Math.floor(rating) : 5 - Math.ceil(rating);
});

Handlebars.registerHelper('truncateText', function (text, max) {
    if (text) {
        max = Number(max);
        if (text.length > max)
            return text.substring(0, max) + '...';
        else
            return text;
    }
    else
        return '';

});

Handlebars.registerHelper('checkPagination', function (pageNo, total, current) {
    var id = parseInt(current / 10) + 1;
    id = id * 10;
    console.log(pageNo, current, id);
    if (Number(pageNo) > id) {
        return 'hide js_page_next';
    } else if (Number(pageNo) < current) {
        if (Number(pageNo) < Number(id - 9)) {
            return 'js_page_prev hide';
        } else {
            return 'js_page_prev';
        }
    }
    return '';
});

Handlebars.registerHelper('checkPaginationPrev', function (current) {
    if (current < 10) {
        return 'in_active';
    }
    return '';
});

Handlebars.registerHelper('checkPaginationNext', function (total, current) {
    var id = parseInt(current / 10);
    if (id !== 1) {
        id = id + 1
    }
    id = id * 10;
    if (id > total) {
        return 'in_active';
    } else {
        return '';
    }
});

Handlebars.registerHelper('removeSpaceAndLink', function (text) {
    text = text.split(' ');
    text = text.join('_').toLocaleLowerCase();
    return text;
});

Handlebars.registerHelper('removeSpaceAndLinkByHyphen', function (text) {
    text = text.split(' ');
    text = text.join('-').toLocaleLowerCase();
    return text;
});

Handlebars.registerHelper('checkRecipeActiveStatus', function (id, arr, success, error) {
    var selectedStatus = error;

    for (var i = 0; i < arr.length; i++) {
        if (arr[i]) {
            if (arr[i].recipeId) {
                console.log(arr[i].recipeId._id);
                if (id.toString() === arr[i].recipeId._id.toString()) {
                    selectedStatus = success;
                }
            }
        }
    }

    return selectedStatus;
});

Handlebars.registerHelper('checkRecipeLikeStatus', function (arr, id, options) {
    if (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                if (arr[i].userId && id) {
                    if (id.toString() === arr[i].userId.toString()) {
                        return options.fn(this);
                    }
                }
            }
        }
    }

    return options.inverse(this);
});

Handlebars.registerHelper('constructIngredientPhotoUrl', function (url, width, height) {
    if (url) {
        url = url.replace('upload/', 'upload/h_' + height + ',w_' + width + '/');
        return url;
    }

    return '/img/default_img.png';
});

Handlebars.registerHelper('inc', function (value, options) {
    return parseInt(value) + 1;
});

Handlebars.registerHelper('checkIndexOf', function (arr, v1, options) {
    if (arr) {
        if (arr.length) {
            if (arr.indexOf(v1) > -1) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
});

Handlebars.registerHelper('formatDate', function(dateString, format) {
    if (dateString && format) {
        return moment(dateString).format(format)
    } else {
        return ''
    }
});

Handlebars.registerHelper('cleanStringForUrl', function (_str) {
    if(_str){
        _str = _str.replace(/\s/g, '-');
    }
    return (_str);
});
