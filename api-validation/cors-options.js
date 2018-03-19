'use strict';

var logger = require('../logger');
var whitelistForCors = require('../whitelist-for-cors');

var corsOptions = {
    origin: function(origin, callback) {
        logger.info("origin: ", origin);
        var whiteList = whitelistForCors.find(function(listedUrl) {
            return listedUrl.includes(origin);
        });

        if (whiteList) {
            logger.info('successfully allowed by CORS');
            return callback(null, true);
        } 
        logger.error('cors error');
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: 'GET, POST'
}

module.exports = corsOptions;