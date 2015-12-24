'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    DiscoverBl = require(path.resolve('./modules/fu/server/bl/discover.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {

    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb(err, discover){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(discover);
        }
    }
    var query = req.query;
    DiscoverBl.get(query, cb);
}

exports.get     = get;