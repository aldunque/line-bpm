var accessPassModel = require('../models/access-pass-model');
var logger = require('.././logger');
function retrieveAccessPass(lineId, token){
        // convert save code above to promise
		var accessPass = accessPassModel.findOne(
			{owner: lineId},
            {access_pass_token: token},
            {status:"active"}
            
		);
		
		accessPass
		.exec(function(res, err){
            // logger.error("retrieveUsers error: ", err);
            console.log("res",res);
		});
		
    return accessPass;
}

module.exports = retrieveAccessPass;