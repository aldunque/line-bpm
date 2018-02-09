var axios = require('axios');
var querystring = require('querystring');
var replyToQuestetra = require('./reply-to-questetra');
var logger = require('../../logger');
var sender = require('./sender');

function checkManagerDetails(managerData, body, client){
    console.log("in checkManagerDetails");
    if (Object.keys(managerData).length) return sender(body, managerData, client);
        logger.error("no manager data retrieved");
        var axiosParameters = {
            url: process.env.REPLYURL_TO_QUESTETRA_REQUEST_STATUS,
            content:{
                processInstanceId:body.process_id,
                key:process.env.KEY_TO_QUESTETRA_REQUEST_STATUS,
                //q_sendingstatus from questetra also be used as query params
                q_sendingstatus:'no manager detail'
            }
        };

        replyToQuestetra(querystring, axios, 'emptyPostBack', axiosParameters);
    
}
module.exports = checkManagerDetails;