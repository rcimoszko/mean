'use strict';

var SportsbookBl = require('../../../fu/server/bl/sportsbook.server.bl');

var pinnacleSportsbook;

SportsbookBl.getPinnacle(function(err, sportsbook){
    pinnacleSportsbook = sportsbook;
});

function getPinnacle(){
    return pinnacleSportsbook
}

exports.getPinnacle = getPinnacle;
