'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    GroupBl = require('../bl/group.server.bl');

function get(req, res, next){
    function cb (err, groups){
        if (err) return next(err);
        if (!groups) {
            return res.status(404).send({
                message: 'Groups not found'
            });
        }
        res.json(groups);
    }
    var sport = req.sport;
    GroupBl.getBySport(sport, cb);
}


exports.get     = get;