'use strict';

//Models
const User = require('../models/user');
const config = require('../config/config');

function checkLogin(req, cb) {
    if (req.cookies && req.cookies.tb_user_token && req.cookies.tb_user_id) {
        User.checkToken(req.cookies.tb_user_id, req.cookies.tb_user_token, function (err, response) {
            if (err === null || !response) {
                cb({err: true, msg: 'User is not valid', data: []});
            }
            if (!err && response) {
                cb({err: false, msg: 'User is valid', data: response});
            }
        })
    } else {
        cb({err: true, msg: 'User Not Logged in'});
    }
}

function clearCookie(req, res) {
    res.clearCookie("tb_user_token");
    res.clearCookie("tb_user_id");
}

exports.isLoggedIn = function (req, res, next) {
    let userActivateUrlRegx = new RegExp("^\/user\/activate\/[0-9,a-z,A-Z^)]*");
    let access_token = config.apiAccessToken.access_token;
    if (req.path === '/login' ||
        req.path === '/register' ||
        req.path === '/forgot-password' ||
        req.path === '/api/user/login' ||
        req.path === '/api/user/register' ||
        req.path === '/user/login' ||
        userActivateUrlRegx.test(req.path) ||
        req.path === '/logout' ||
        req.path === '/user/checkLogin') {

        next();
    } else if (access_token === req.headers.access_token) {
        next();
    } else {
        checkLogin(req, function (data) {
            if (data.err) {
                //Clear User cookie
                clearCookie(req, res);

                //Redirect To Login Page
                res.redirect('/login?ref=' + req.originalUrl);

            } else {
                res.cookie('tb_user_token', data.data.token.token);
                res.cookie('tb_user_id', data.data.user_id);

                next();
            }
        });
    }
};
