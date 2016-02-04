'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UserBl = require('../bl/user.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {

    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }


    function cb(err, following){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(following);
        }
    }

    var user = req.user;
    var query = req.query;

    UserBl.getFollowing(user, query, cb);
}


exports.get     = get;