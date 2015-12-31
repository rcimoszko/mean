'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    MakePicksBl = require(path.resolve('./modules/fu/server/bl/makepicks.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {


    function cb(err, makepicksMenu){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(makepicksMenu);
        }
    }

    MakePicksBl.getMenu(cb);
}

exports.get     = get;