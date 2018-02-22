var logger = require('../logger');
const crypto = require('crypto');
const channelSecret  = process.env.LINE_BOT_CHANNEL_SECRET;
const verify = crypto.createVerify('SHA256');

function checkSource(sourceSignature, req, res, next) {
    if(sourceSignature == req.headers['x-line-signature']) {
        logger.info('source is from line');
        const lineBody = JSON.stringify(req.body);
        const lineBodySignature = crypto.createHmac('SHA256', channelSecret).update(lineBody).digest('base64');
        logger.info('body signature is: ', lineBodySignature);
    
        // TODO: add passing api validation after lineBodySignature is equal too sourceSignature
        if(lineBodySignature == sourceSignature) {
            logger.info('body signature is: ', lineBodySignature, ' is matched to line source signature'); 
            next();
        }    
    }
}

module.exports =  checkSource;