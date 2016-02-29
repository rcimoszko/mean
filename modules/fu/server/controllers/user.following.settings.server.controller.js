'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UserBl = require('../bl/user.server.bl'),
    FollowBl = require('../bl/follow.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Follow Id is invalid'
        });
    }

    function cb (err, follow){
        if (err) return next(err);
        if (!follow) {
            return res.status(404).send({
                message: 'Follow not found'
            });
        }
        req.follow = follow;
        next();
    }

    FollowBl.get(id, cb);
}

function getAll(req, res) {

    function cb(err, followSettings){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(followSettings);
        }
    }

    var user = req.user;

    FollowBl.getFollowingListSettings(user, cb);
}

function update(req, res, next){
    function cb (err,followSettings){
        if (err) return next(err);
        if (!followSettings) {
            return res.status(500).send({
                message: 'Failed to update follow'
            });
        }
        console.log(followSettings);
        res.json(followSettings);

    }
    var follow = req.follow;
    var data = req.body;
    console.log(follow);
    console.log(data);

    FollowBl.updateNotify(data, follow, cb);
}


exports.getAll  = getAll;
exports.byId    = byId;
exports.update  = update;