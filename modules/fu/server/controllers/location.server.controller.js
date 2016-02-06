'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    LocationBl = require('../bl/location.server.bl');


function get(req, res, next){
    function cb (err, location){
        if (err) return next(err);
        res.json(location);
    }

    LocationBl.getLocation(req, cb);
}


exports.get     = get;