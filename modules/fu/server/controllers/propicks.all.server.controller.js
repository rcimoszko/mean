'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    ProPicksBl = require('../bl/propicks.server.bl');


function get(req, res, next){

    function cb (err, proPicks){
        if (err) return next(err);
        if (!proPicks) {
            return res.status(404).send({
                message: 'Invalid query'
            });
        }
        res.json(proPicks);
    }

    ProPicksBl.getAll(cb);
}


exports.get     = get;