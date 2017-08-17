'use strict';

const express = require('express');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const compression = require('compression');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const winston = require('winston');
const RedisStore = require('connect-redis')(require('express-session'));
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//Models
const User = require('./models/user');
//Routes
const index = require('./routes/index');
const api = require('./routes/api');
const user = require('./routes/user');
//Helpers
const config = require('./config/config');
const verify = require('./config/verify');
//Mongodb
mongoose.connect(config.mongoUrl);
mongoose.Promise = global.Promise;
app.use(compression());
app.use(require('express-session')({
    store: new RedisStore({ host: 'localhost', port: 6379 }),
    secret: config.secretKey,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }
}));
// view engine setup
app.engine('.hbs', exphbs({
    extname: '.hbs',
    layoutsDir: 'views',
    helpers: require('./server_side_helpers/server_handlebar_helpers'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.engine('handlebars', exphbs());
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', '/img/favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Logging
global.log = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            timestamp: () => {
                return new Date().toString()
            },
            json: true
        }),
    ]
});

// passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use('local', new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Routing
app.use(verify.isLoggedIn);
app.use('/', index);
app.use('/api', api);
app.use('/api/user', user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
