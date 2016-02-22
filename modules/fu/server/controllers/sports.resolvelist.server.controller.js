'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    SportBl = require('../bl/sport.server.bl');

function get(req, res, next){
    function cb (err, sports){
        if (err) return next(err);
        if (!sports) {
            return res.status(404).send({
                message: 'Sports not found'
            });
        }
        res.json(sports);
    }

    SportBl.getResolveList(cb);
}


exports.get     = get;