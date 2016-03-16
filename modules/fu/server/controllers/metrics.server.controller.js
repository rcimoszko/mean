'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    MetricsBl = require(path.resolve('./modules/fu/server/bl/metrics.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {
    function cb(err, metrics){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(metrics);
        }
    }
    var query = req.query;
    MetricsBl.getEngagement(query, cb);
}

exports.get     = get;