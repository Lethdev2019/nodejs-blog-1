'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../config/config'),
    passportLocalMongoose = require('passport-local-mongoose'),
    jwt = require('jwt-simple'),
    tokenSecret = 'set-A-$KfSd3t-h3re';

const Token = new Schema({
    token: {type: String},
    date_created: {type: Date, default: Date.now},
});

Token.statics.hasExpired = function (created) {
    const now = new Date();
    const diff = (now.getTime() - created);
    return diff > config.ttl;
};
const TokenModel = mongoose.model('Token', Token);

const User = new Schema({
    username: {type: String, unique: true},
    password: String,
    name: {type: String, default: 'Anonymous'},
    mobile: {type: Number, default: 0},
    gender: {type: Number, default: 0},
    email: {type: String, unique: true},
    isActive: {type: Boolean, default: false},
    isBlock: {type: Boolean, default: false},
    isVerified: {type: Boolean, default: false},
    userType: {type: Number, default: 6},
    date_created: {type: Date, default: Date.now},
    token: {type: Object},
    reset_token: {type: String},
    reset_token_expires_millis: {type: Number}
});

User.plugin(passportLocalMongoose, {usernameField: 'email'});

User.statics.encode = function (data) {
    return jwt.encode(data, tokenSecret);
};

User.statics.decode = function (data) {
    return jwt.decode(data, tokenSecret);
};

User.statics.checkToken = function (userId, token, cb) {
    this.findOne({_id: userId}, function (err, usr) {
        if (err || !usr) {
            cb(err, null);
        } else if (usr.token && usr.token.token && token === usr.token.token) {
            cb(false, {
                user_id: usr._id,
                name: usr.name,
                user_type: usr.userType,
                token: usr.token
            });
        } else {
            cb(new Error('Token does not exist or does not match.'), null);
        }
    });
};

User.statics.findUser = function (email, token, cb) {
    this.findOne({email: email}, function (err, usr) {
        if (err || !usr) {
            cb(err, null);
        } else if (usr.token && usr.token.token && token === usr.token.token) {
            cb(false, {email: usr.email, token: usr.token, date_created: usr.date_created, full_name: usr.full_name});
        } else {
            cb(new Error('Token does not exist or does not match.'), null);
        }
    });
};

User.statics.findUserByEmailOnly = function (email, cb) {
    let self = this;
    this.findOne({email: email}, function (err, usr) {
        if (err || !usr) {
            cb(err, null);
        } else {
            cb(false, usr);
        }
    });
};

User.statics.createUserToken = function (email, cb) {
    let self = this;
    this.findOne({email: email}, function (err, usr) {
        if (err || !usr) {
            console.log('err');
        }
        const token = self.encode({email: email});
        usr.token = new TokenModel({token: token});
        usr.save(function (err, usr) {
            if (err) {
                cb(err, null);
            } else {
                cb(false, usr.token.token);//token object, in turn, has a token property :)
            }
        });
    });
};

User.statics.invalidateUserToken = function (email, cb) {
    this.findOne({email: email}, function (err, usr) {
        if (err || !usr) {
            console.log('err');
        }
        usr.token = null;
        usr.save(function (err, usr) {
            if (err) {
                cb(err, null);
            } else {
                cb(false, 'removed');
            }
        });
    });
};

User.statics.generateResetToken = function (email, cb) {
    this.findUserByEmailOnly(email, function (err, user) {
        if (err) {
            cb(err, null);
        } else if (user) {
            let now = new Date();
            user.reset_token = require('crypto').randomBytes(32).toString('hex');
            user.reset_token_expires_millis = new Date(now.getTime() + (config.resetTokenExpiresMinutes * 60 * 1000)).getTime();
            user.save();
            cb(false, user);
        } else {
            cb(new Error('No user with that email found.'), null);
        }
    });
};

module.exports = mongoose.model('User', User);
module.exports.Token = TokenModel;
