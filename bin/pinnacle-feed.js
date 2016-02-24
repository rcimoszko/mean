#!/usr/bin/env node

var mongoose = require('mongoose'),
    uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/fu4-dev';
    require('../modules/pinnacle/server/models/pinnacleContestant.server.model.js');
    require('../modules/pinnacle/server/models/pinnacleLeague.server.model.js');
    require('../modules/pinnacle/server/models/pinnacleSport.server.model.js');
    require('../modules/users/server/models/user.server.model.js');
    require('../modules/fu/server/models/notification.server.model.js');
    require('../modules/fu/server/models/follow.server.model.js');
    require('../modules/fu/server/models/event.server.model.js');

process.env.NODE_ENV = 'production';

mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});


var PinnacleService = require('../modules/pinnacle/server/services/pinnacle.server.service.js');


function pinnacleFeed() {
    function cb(err){
        if(err)console.log(err);
        mongoose.connection.close();
    }

    PinnacleService.runFeed(cb);
}

pinnacleFeed();