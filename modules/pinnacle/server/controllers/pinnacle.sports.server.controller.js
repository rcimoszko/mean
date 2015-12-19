'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    PinnacleSportBl = require(path.resolve('./modules/pinnacle/server/bl/pinnacleSport.server.bl')),
    errorHandler = require(path.resolve('./modules/pinnacle/server/sys/error.server.sys'));


function byId(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Author is invalid'
        });
    }

    function cb(err, pinnacleSport) {
        if (err) {
            return next(err);
        } else if (!pinnacleSport) {
            return res.status(404).send({
                message: 'No pinnacleSport with that identifier has been found'
            });
        }
        req.pinnacleSport = pinnacleSport;
        next();
    }

    PinnacleSportBl.get(id, cb);

}

function getAll(req, res) {
    function cb(err, pinnacleSports){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pinnacleSports);
        }
    }

    PinnacleSportBl.getAll(cb);
}

function get(req, res) {
    res.json(req.pinnacleSport);
}

function update(req, res) {

    function cb(err, pinnacleSport){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pinnacleSport);
        }
    }

    var pinnacleSport = req.pinnacleSport;
    PinnacleSportBl.update(req.body, pinnacleSport, cb);

}

exports.byId    = byId;
exports.getAll  = getAll;
exports.get     = get;
exports.update  = update;