'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    PinnacleContestantBl = require(path.resolve('./modules/pinnacle/server/bl/pinnacleContestant.server.bl')),
    errorHandler = require(path.resolve('./modules/pinnacle/server/sys/error.server.sys'));


function byId(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Author is invalid'
        });
    }

    function cb(err, pinnacleContestant) {
        if (err) {
            return next(err);
        } else if (!pinnacleContestant) {
            return res.status(404).send({
                message: 'No pinnacleContestant with that identifier has been found'
            });
        }
        req.pinnacleContestant = pinnacleContestant;
        next();
    }

    PinnacleContestantBl.get(id, cb);

}

function getAll(req, res) {
    function cb(err, pinnacleContestants){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pinnacleContestants);
        }
    }

    PinnacleContestantBl.getAll(cb);
}

function get(req, res) {
    res.json(req.pinnacleContestant);
}

function update(req, res) {

    function cb(err, pinnacleContestant){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pinnacleContestant);
        }
    }

    var pinnacleContestant = req.pinnacleContestant;
    PinnacleContestantBl.update(req.body, pinnacleContestant, cb);

}

exports.byId    = byId;
exports.getAll  = getAll;
exports.get     = get;
exports.update  = update;