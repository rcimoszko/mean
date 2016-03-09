#!/usr/bin/env node
var mongoose = require('mongoose'),
    uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/fu4-dev';
require('../modules/pinnacle/server/models/pinnacleContestant.server.model.js');
require('../modules/pinnacle/server/models/pinnacleLeague.server.model.js');
require('../modules/pinnacle/server/models/pinnacleSport.server.model.js');
require('../modules/users/server/models/user.server.model.js');
require('../modules/message/server/models/conversation.server.model.js');
require('../modules/message/server/models/message.server.model.js');
require('../modules/fu/server/models/notification.server.model.js');
require('../modules/fu/server/models/follow.server.model.js');
require('../modules/fu/server/models/subscription.server.model.js');
require('../modules/fu/server/models/comment.server.model.js');
require('../modules/fu/server/models/channel.server.model.js');
require('../modules/fu/server/models/chat.server.model.js');
require('../modules/fu/server/models/verificationtoken.server.model.js');
require('../modules/fu/server/models/event.server.model.js');


var AdminService = require('../modules/fu/server/services/admin.server.service.js');

mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);

        function checkTrial() {
            function cb(err){
                console.log('done');
                if(err)console.log(err);
                mongoose.connection.close();
            }

            AdminService.checkTrial(cb);
        }

        checkTrial();
    }
});

