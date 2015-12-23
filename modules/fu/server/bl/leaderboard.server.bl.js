'use strict';

var mongoose = require('mongoose'),
    League = mongoose.model('League'),
    Pick = mongoose.model('Pick'),
    path = require('path'),
    _ = require('lodash'),
    async = require('async');


function get(query, callback){
    callback(null);
}

exports.get         = get;