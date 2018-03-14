'use strict';
var UserSchema = require('../schema/user-schema');
var logger = require('../logger');
var errorLocator = require('../node/error-locator');

function UserModel() {
    if (!(this instanceof UserModel)) return new UserModel();
}

UserModel.prototype = {
    save: save,
    retrieveByLineId: retrieveByLineId,
    retrieveByEmpId: retrieveByEmpId,
    retriveByEmpEmail: retriveByEmpEmail
};
    
function save(userData) {

    var newUser = new UserSchema();
    newUser.line_id = userData.lineID;
    newUser.employee_id = userData.employee_id;
    newUser.employee_name = userData.name;
    newUser.employee_email = userData.email;
    newUser.locale = userData.locale;
        
    newUser.save()
        .then(function() {
            logger.info('data saved');
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(error.stack); 
        }); 
}

function retrieveByLineId(lineID) {

    var users = UserSchema.findOne({line_id: lineID});
    users
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message); logger.error(errorLocator());}
        });	
    return users; 
}

function retrieveByEmpId(receivedEmployeeID) {
    var users = UserSchema.findOne({employee_id: receivedEmployeeID});
    
    users
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message); logger.error(errorLocator());}
        });	

    return users;
}

function retriveByEmpEmail (receivedEmployeeEmail) {
    var users = UserSchema.findOne({employee_email: receivedEmployeeEmail});

    users
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message); logger.error(errorLocator());}
        });	

    return users;
}

module.exports = UserModel;