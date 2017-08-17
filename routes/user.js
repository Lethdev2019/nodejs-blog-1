'use strict';

let Mail = require('./util/mail'),
    passport = require('passport'),
    User = require('../models/user'),
    verify = require('../config/verify');
let express = require('express');
let router = express.Router();


router.post('/register', function (req, res) {
    User.register(new User({
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            mobile: req.body.mobile,
            username: req.body.email,
            isActive: true
        }),
        req.body.password,
        function (error, user) {
            if (error) {
                return res.json({err: true, msg: error.message});
            }
            let mailOptions = {
                from: 'info@example.com',
                to: req.body.email,
                subject: 'Example.com - Verify Your Email Address',
                body: 'Hi, ' + req.body.name + ' Click here to activate your account : http://' + req.headers.host + '/user/activate/' + user.salt
            };
            // Mail.sendMail(mailOptions);
            return res.json({
                err: false,
                msg: 'An email has been sent to the email address provided. Please verify your email by clicking the link send by us.'
            });
        });
});

router.post('/checkLogin', function (req, res) {
    if (req.cookies.hasOwnProperty('tb_user_token') && req.cookies.hasOwnProperty('tb_user_id')) {
        User.checkToken(req.cookies.tb_user_token, req.cookies.tb_user_id, function (err, response) {
            if (err) {
                res.json({err: true, msg: 'User is not valid', data: []});
            }
            if (!err && response) {
                res.json({err: false, msg: 'User is valid', data: response});
            }
        })
    } else {
        res.json({err: true, msg: 'Params are missing', data: []});
    }
});

router.post('/login', function (req, res) {
    if (req.isAuthenticated()) return res.json({err: true, msg: "Already loggedin"});
    passport.authenticate('local', function (er, user, info) {
        if (er) {
            return res.json({err: true, msg: "Username/Password is incorrect"});
        }
        if (!user) {
            return res.json({err: true, msg: "Username/Password is incorrect"});
        }
        req.logIn(user, function (error) {
            if (error) {
                return res.json({err: true, msg: "Username/Password is incorrect"});
            } else {
                if (!user.isActive) {
                    req.logout();
                    return res.json({err: true, msg: "Please activate your account"});
                } else if (user.isBlock) {
                    req.logout();
                    return res.json({err: true, msg: "Your account blocked. Please contact administrator"});
                } else {
                    let url = req.session.requrl ? req.session.requrl : '/';
                    User.createUserToken(user.email, function (err, usersToken) {
                        if (err) {
                            res.json({error: 'Issue generating token'});
                        } else {
                            //Store user details on session
                            req.session.user = user;
                            //set a user cookie
                            res.cookie('tb_user_id',  user._id.toString(), {maxAge: 2592000, httpOnly: true});
                            res.cookie('tb_user_token', usersToken, {maxAge: 2592000, httpOnly: true});

                            res.json({
                                user_id: user._id,
                                name: user.name,
                                user_type: user.userType,
                                token: usersToken
                            });
                        }
                    });
                }
            }
        });
    })(req, res);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('http://' + req.headers.host + '/login');
});

router.get('/activate/:id', function (req, res) {
    User.findOneAndUpdate({salt: req.params.id}, {isActive: true}, function (error, user) {
        if (error) return res.json({err: true, msg: error.message});
        res.redirect('http://' + req.headers.host + '/login?accountVerified=true');
    });
});

router.post('/role/update/:id',  function (req, res) {
    User.findOneAndUpdate({_id: req.params.id}, {userType: req.body.userType}, function (error, user) {
        if (error) return res.json({err: true, msg: error.message});
        return res.json({err: false, msg: "User Role Updated Successfully!"});
    });
});

router.get('/password/update', verify.isLoggedIn, function (req, res) {
    res.render('adminPasswordUpdate', {user_id: (req.user) ? req.user._id : ''});
});

router.post('/password/update', verify.isLoggedIn, function (req, res) {
    User.findOne({_id: req.body._id}, function (error, user) {
        if (error) return res.json({err: true, msg: error.message});
        user.setPassword(req.body.password, function (er) {
            if (!er) {
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            } else {
                console.log(er)
            }
        });
        return res.json({err: false, msg: "Password updated!"});
    });
});

module.exports = router;

