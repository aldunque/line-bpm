'use strict';
var accessPassModel = require('../models/access-pass-model');
var logger = require('../logger');
function retrieveAccessPassOwner(lineId){
        // convert save code above to promise
		var accessPassOwner = accessPassModel.findOne(
			{owner: lineId,
            status:"active"}
            
		);
		
		accessPassOwner
		.exec(function(res, err){
			logger.info('res',res);
		});
		
    return accessPassOwner;
}

module.exports = retrieveAccessPassOwner;