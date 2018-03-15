'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');

function AccessPass(accessPassData = {}) {
    if (!(this instanceof AccessPass)) return new AccessPass();
    //constructor
    this.access_pass_token = accessPassData.access_pass_token || null ;
    this.line_id = accessPassData.access_pass_token || null ;
    this.status = accessPassData.access_pass_token || null ;
}

AccessPass.prototype = {
    save: save,
    changeAccessPass: changeAccessPass,
    expireAccessPass: expireAccessPass,
    retrieveLineId: retrieveLineId,
    retrieve: retrieve
};

function save (token, lineId) {
    var newAccessPass = new accessPassModel();
    newAccessPass.access_pass_token = token;
    newAccessPass.line_id = lineId;
    newAccessPass.status = "active";
    newAccessPass.save()
        .then(function(savedObject) {
            logger.info('access pass saved');
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(error.stack);
        }); 
}

function changeAccessPass (lineId, token) {
    accessPassModel.updateMany({ line_id: lineId }, 
        { $set: {access_pass_token: token }},
    
        function() {
            logger.info("Access pass with the :" + lineId + " owner was changed");
        });
}

function expireAccessPass (lineId) {
    accessPassModel.updateMany({ 
        line_id: lineId, 
        status: "active" }, 
    { $set: {status: "expired"}},

    function() {
        logger.info("all access pass with the :" + lineId + " owner was updated to expired");
    });
}

function retrieveLineId (lineId) {
    var accessPassOwner = accessPassModel.findOne({
        line_id: lineId,
        status: "active"
    });		
    accessPassOwner
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message);}
        });
            
    return accessPassOwner;
}

function retrieve (lineId, token) {
    var accessPass = accessPassModel.findOne({
        line_id: lineId, 
        access_pass_token: token, 
        status: "active"
    });
    accessPass
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message);}
        });
            
    return accessPass;
}


module.exports = AccessPass;