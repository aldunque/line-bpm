'use strict';
var logger = require('../logger');
var axios = require('axios');
var querystring = require('querystring');
var errorLocator = require('../node/error-locator');

function Questetra() {
    if (!(this instanceof Questetra)) return new Questetra();
}

Questetra.prototype = {
    reply,
    incomingMessage,
    outgoingMessage
};

function reply(axiosParameters) {
    logger.info('reply');
    var throttleCounter = 0;
    //1000 = 1sec
    var replyDelayTime = 6000;

    (function resendReplyToQuestetra() {
        setTimeout(postReplyToQuestetra, replyDelayTime, resendReplyToQuestetra);
    })();

    function postReplyToQuestetra(resendReplyToQuestetra) {
        axios.post(axiosParameters.url, querystring.stringify(axiosParameters.content))
            .then(function(response) { 
                logger.info('success replying to questetra');            
            })            
            .catch(function(error) {
                if (throttleCounter >= 10) return;
                throttleCounter++;
                resendReplyToQuestetra();
            }); 
    }
}

function incomingMessage(instanceId, isMessageSent) {
    logger.info('incomingMessage');
    var axiosParameters = {
        url: process.env.REPLYURL_TO_QUESTETRA_REQUEST_STATUS,
        content: {
            processInstanceId: instanceId,
            key: process.env.KEY_TO_QUESTETRA_REQUEST_STATUS,
            //q_sendingstatus from questetra also be used as query params
            q_sendingstatus: isMessageSent
        }
    };
    reply(axiosParameters);
}

function outgoingMessage(postBack, client, line_userId) {
    logger.info('outgoingMessage');
    let Line = require('./Line');
    let RequestModel = require('../model/RequestModel');

    var parsedData = (querystring.parse(postBack.data));
    var axiosParameters = {
        url: process.env.REPLYURL_TO_QUESTETRA,
        content: {
            processInstanceId: parsedData.processInstanceId,
            key: process.env.KEY_TO_QUESTETRA,
            //q_replymessage from questetra also be used as query params
            q_replymessage: parsedData.q_replymessage
        }
    };
    var retrievedRequestData = RequestModel().retrieve(parsedData.processInstanceId);

    retrievedRequestData
        .then(function (retrievedRequestData) {
            Line().notifyUserResponded(retrievedRequestData, client, line_userId, parsedData);
        })
        .catch(function (error) {
            logger.error(error.message);
            logger.error(errorLocator());
        });   
    reply(axiosParameters);
}


module.exports = Questetra;