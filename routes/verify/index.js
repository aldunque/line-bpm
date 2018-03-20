'use strict';
var Translation = require('../../service/Translation');
var logger = require('../../logger');
var errorLocator = require('../../node/error-locator');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });
var UserModel = require('../../model/UserModel');
var AccessPassModel = require('../../model/AccessPassModel');
function verify(router, lineBotId) {
    router.get('/verify/:token/:line_id', csrfProtection, function(req, res) {
        var localeText = Translation().get('verify-content');
        var lineID = req.params.line_id;
        var token = req.params.token;
        var users = UserModel().retrieveByLineId(lineID);    
        users.then(function(users) {
            if (users) {
                logger.warn("The line ID:", lineID, "is already verified");
                return res.render('verify-error', {
                    message: localeText.errorMessageLineIdExists,
                    backButtonText: localeText.button.back,
                    lineBotId: lineBotId
                })
            }
            var retrievedAccessPass = AccessPassModel().retrieve(lineID, token);
            retrievedAccessPass
                .then(function(retrievedAccessPass) {
                    if (retrievedAccessPass == null) {
                        return res.render('unauthorized-access', {
                            message: localeText.error.unauthorizedAccess,
                        })
                    }
                    logger.info("verify page has loaded...");   
                    res.render('verify', {
                        title: localeText.pageTitle.title,
                        panelTitle: localeText.label.panelTitle,
                        verifyButtonText: localeText.button.verify,
                        usernamePlaceholder: localeText.placeHolder.username, 
                        passwordPlaceholder: localeText.placeHolder.password,
                        lineID: lineID,
                        token: token,
                        csrfToken: req.csrfToken(),
                        verified: false,
                        errors: {},
                        customError: ''   
                    });    
                })
                .catch(function(error) {
                    logger.error(error.message);
                    logger.error(error.stack);
                }); 
        })
            .catch(function(error) {
                logger.error(error.message);
                logger.error(errorLocator());          
            }); 
    });
}

module.exports = verify;