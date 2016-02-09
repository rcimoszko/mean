
'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    HubBl = require('../bl/hub.server.bl');


function get(req, res, next){

    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb (err, hub){
        if (err) return next(err);
        if (!hub) {
            return res.status(404).send({
                message: 'Invalid query'
            });
        }
        res.json(hub);
    }

    HubBl.getPicks(req.query, req.user, cb);
}


exports.get     = get;