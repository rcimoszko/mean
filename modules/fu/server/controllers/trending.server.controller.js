'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    TrendingBl = require('../bl/trending.server.bl');


function get(req, res, next){
    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb (err, trending){
        if (err) return next(err);
        if (!trending) {
            return res.status(404).send({
                message: 'Invalid query'
            });
        }
        res.json(trending);
    }

    TrendingBl.get(req.query, cb);
}


exports.get     = get;