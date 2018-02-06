var scanQrCode = require('./scan-qr-code');
var informUserExistence = require('./user-inform-if-exist');
var toNode = require('./to-node');
var retrieveUserByLineId = require('.././retrieve-user-by-line-id');
function handler(router, axios, querystring, client){
    router.post('/handler', function(req, res) {
        var eventType = req.body.events[0].type;
        var line_userId = req.body.events[0].source.userId;

        if(eventType == "follow"){
            console.log("eventType",eventType);
            var users = retrieveUserByLineId(line_userId);

            users
            .then(function (users){
                if(users){
                    informUserExistence(client,line_userId,users.employee_name)
                }else{
                    scanQrCode(client,line_userId)
                } 
                
            })
            .catch(function (){
                console.log(error)
            });
            
            
        } 
        if(eventType == "postback"){
            if(req.body.events[0].postback != null && req.body.events[0].message == null){
                //postBack is data query params depending on manager reply
                var postBack = req.body.events[0].postback;
                toNode(querystring, axios, postBack);
            }
        }

        res.send(true)
    });
}

module.exports = handler;