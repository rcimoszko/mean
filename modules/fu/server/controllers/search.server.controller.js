'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    SearchBl = require('../bl/search.server.bl');


function get(req, res, next){
    function cb (err, results){
        if (err) return next(err);
        if (!results) {
            return res.status(404).send({
                message: 'No results found'
            });
        }
        res.json(results);
    }
    var user = req.user;
    SearchBl.get(user, cb);
}


exports.get     = get;
