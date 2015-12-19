'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    PinnacleLeagueBl = require(path.resolve('./modules/pinnacle/server/bl/pinnacleLeague.server.bl')),
    errorHandler = require(path.resolve('./modules/pinnacle/server/sys/error.server.sys'));


function byId(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Author is invalid'
        });
    }

    function cb(err, pinnacleLeague) {
        if (err) {
            return next(err);
        } else if (!pinnacleLeague) {
            return res.status(404).send({
                message: 'No pinnacleLeague with that identifier has been found'
            });
        }
        req.pinnacleLeague = pinnacleLeague;
        next();
    }

    PinnacleLeagueBl.get(id, cb);

}

function getAll(req, res) {
    function cb(err, pinnacleLeagues){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pinnacleLeagues);
        }
    }

    PinnacleLeagueBl.getAll(cb);
}

function get(req, res) {
    res.json(req.pinnacleLeague);
}

function update(req, res) {

    function cb(err, pinnacleLeague){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pinnacleLeague);
        }
    }

    var pinnacleLeague = req.pinnacleLeague;
    PinnacleLeagueBl.update(req.body, pinnacleLeague, cb);

}

exports.byId    = byId;
exports.getAll  = getAll;
exports.get     = get;
exports.update  = update;