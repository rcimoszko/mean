'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    SearchBl = require('../bl/search.server.bl');


function get(req, res, next){

    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb (err, results){
        if (err) return next(err);
        if (!results) {
            return res.status(404).send({
                message: 'No results found'
            });
        }
        res.json(results);
    }
    var username = req.query.username;
    SearchBl.getUsers(username, cb);
}


exports.get     = get;
