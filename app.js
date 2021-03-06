'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morganLogger = require('morgan');
var winLogger = require('winston');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var env = require('node-env-file');
var logger = require('./logger');

const app = express();
// env files
env(__dirname + '/.env');

const port = process.env.PORT || 4000;

var handler = require('./routes/app');
var api = require('./routes/api');

app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morganLogger('dev'));

// begin using node line bot - need raw buffer for signature validation
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// start passport init
app.use(cookieSession({
    name: process.env.COOKIE_SESSION_NAME,
    keys: process.env.COOKIE_SESSION_KEY
}));

app.use(passport.initialize());
// app.use(passport.session());

app.use('/', handler);
app.use('/api', api);

// validator
app.use(expressValidator);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = process.env.APP_ENV === 'development' ? err : {};
  
    // winston logger for separate logs
    winLogger.error(err);
    winLogger.log(err);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
// listen on port
app.listen(port, () => {
    logger.info(`listening on ${port}`);
});

module.exports = app;
