'use strict';
var retrieveUser = require('../retrieve-users');
var logger = require('../../logger');
var checkManagerDetails = require('../line/checker-of-manager-details');
function receiver(router, client){
    router.post('/receiveFromQuest', function(req, res) {
        var managerData = {};
        var users = retrieveUser('empty',req.body.manager_email);
        
        users.then(function(users){
          if(!users) return logger.error("no manager data retrieved");
          
          logger.info("manager data retrieved");
          managerData = users;
          console.log("managerData",managerData)
          checkManagerDetails(managerData, req.body, client);  
        })
        .catch(function(err){
          logger.error(err);
        });
        res.send(true);      
    });
     
}
module.exports = receiver;