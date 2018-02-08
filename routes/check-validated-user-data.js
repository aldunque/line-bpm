var retrieveUsers = require('./retrieve-users'); 
var verifyUserWithLineId = require('./verify-user-with-line-id');
var localeChecker = require('./locale/locale-checker');
var logger = require('../logger');

var employeeDetails = {};

function checkValidatedUserData(passport, req, res, client, lineID, validatedUserData) {
    // check if user is in local db
    var users = retrieveUsers(lineID, 'empty');
    var localeText= localeChecker('jp','verify-content');

    if (!validatedUserData) return logger.error("User data not validated");
    users.then(function(users){
        if (users){
            logger.info("The line ID:", lineID, "is already verified");
            return res.render('verify-error', {message: localeText.error.lineIdAlreadyExists});
        }
        // authenticate start
        passport.authenticate('tmj', function(err, user, info) {
            var throwErr = err || info;         
            if (throwErr) {
                logger.error("Authenticate error: ", throwErr);
                 return res.status(400).render('verify-error', {message: localeText.error.wrongCredentials});          
            }
            req.logIn(user, function(err) {
                if (err) {
                    logger.error("Error 404: ", err.message);
                     // redirect with localetext
                    return res.status(400).render('verify-error', {message: err.message});                      
                }
                
                employeeDetails = {
                    lineID: lineID,
                    name: user.name,
                    employee_id: user.employee_id,
                    email: user.email
                };

                verifyUserWithLineId(employeeDetails, res, client, lineID);
            });
        })(req,res);               
    })
    .catch(function(err){
        logger.error(err);
    });     
}

module.exports = checkValidatedUserData;  