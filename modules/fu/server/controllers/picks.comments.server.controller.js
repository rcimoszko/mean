'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    CommentBl = require(path.resolve('./modules/fu/server/bl/comment.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {
    function cb(err, pick){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pick);
        }
    }

    var pick = req.pick;
    CommentBl.getByPick(pick, cb);
}

exports.get  = get;