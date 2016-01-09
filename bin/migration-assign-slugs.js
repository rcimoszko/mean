#!/usr/bin/env node

var mongoose = require('mongoose'),
    uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/fu4-dev';
    require('../modules/fu/server/models/event.server.model.js');

process.env.NODE_ENV = 'production';

mongoose.connect(uristring, function (err, res) {
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});



var AdminService = require('../modules/fu/server/services/admin.server.service.js');


function assignSlugs() {
    function cb(err){
        if(err)console.log(err);
        mongoose.connection.close();
    }

    AdminService.assignSlugs(cb);
}

assignSlugs();