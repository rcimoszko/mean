'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UserBl = require('../bl/user.server.bl');


function get(req, res, next){

    function cb (err, users){
        if (err) return next(err);
        if (!users) {
            return res.status(404).send({
                message: 'Users not found'
            });
        }
        res.json(users);
    }

    UserBl.getNew(cb);
}

exports.get        = get;