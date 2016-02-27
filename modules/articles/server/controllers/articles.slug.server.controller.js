'use strict';

var path = require('path'),
    mongoose = require('mongoose');


function get(req, res, next){
    res.json(req.article);
}

exports.get     = get;