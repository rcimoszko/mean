
'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    HubBl = require('../bl/hub.server.bl');


function get(req, res, next){

    function cb (err, hub){
        //console.log(hub);
        if (err) return next(err);
        if (!hub) {
            return res.status(404).send({
                message: 'Invalid query'
            });
        }
        res.json(hub);
    }

    HubBl.get(cb);
}


exports.get     = get;