'use strict';
var RequestSchema = require('../schema/request-schema');
var logger = require('../logger');
var errorLocator = require('../node/error-locator');


function RequestModel() {
    //constructor
    if (!(this instanceof RequestModel)) return new RequestModel();
}

RequestModel.prototype = {
    save,
    retrieve,
    updateToCancel,
    updateToApproveDisapprove   
};

function save (requestData) {
    logger.info('RequestModel save');
    var newRequest = new RequestSchema();

    newRequest.user_name = requestData.user_name;
    newRequest.overtime_date = requestData.overtime_date;
    newRequest.process_id = requestData.process_id;
    newRequest.reason = requestData.reason;
    newRequest.status = requestData.status;
    newRequest.manager_email = requestData.manager_email;
    
    newRequest.save()
        .then(function() {
            logger.info('data saved');
        })
        .catch(function(error) {
            logger.error(error.message);
            logger.error(error.stack); 
        }); 
}

function retrieve (requestId) {
    logger.info('RequestModel retrieve');
    var overtimeRequest = RequestSchema.findOne({process_id: requestId,
        $or: [{status: "approved"}, {status: "declined"}, {status: "cancelled"}]});
        
    overtimeRequest
        .exec(function(res, err) {
            if (err.message) { logger.error(err.message); logger.error(errorLocator());}      
        });	
    return overtimeRequest;
}

function updateToCancel(requestData) {
    logger.info('RequestModel updateToCancel');
    RequestSchema.update({ process_id: requestData.process_id }, 
        { $set: {status: "cancelled"}},
    
        function() {
            logger.info("process_id :" + requestData.process_id + " was updated to cancel");
        });
}

function updateToApproveDisapprove(requestData) {
    logger.info('RequestModel updateToApproveDisapprove');
    var replymessage = requestData.q_replymessage ;
    var requestStatus = {
        yes: "approved",
        no: "declined"
    };
    RequestSchema
        .findOneAndUpdate({process_id: requestData.processInstanceId, status: "pending"},
            {status: requestStatus[replymessage]},
            function() {
                logger.info('updated');
            }
        );        
}

module.exports = RequestModel;