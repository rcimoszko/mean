'use strict';

var geoip = require('geoip-lite');

function getLocation(req, callback) {
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    console.log(ip);
    var geo = geoip.lookup(ip);
    if(!geo) geo = {country: null};
    callback(null, geo);
}

exports.getLocation = getLocation;
