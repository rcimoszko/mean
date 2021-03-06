'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    MakePicksBl = require(path.resolve('./modules/fu/server/bl/makepicks.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {

    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb(err, makepicks){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(makepicks);
        }
    }
    var query = req.query;
    MakePicksBl.getPicks(query, cb);
}

exports.get     = get;