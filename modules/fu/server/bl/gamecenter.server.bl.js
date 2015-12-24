'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    m_Event = mongoose.model('Event');


function get(event, callback){
    callback(null);
}

function getBySlug(slug, callback){

    function cb(err, event){
        callback(err, event);
    }

    m_Event.findOne({slug:slug}).exec(cb);
}

exports.get         = get;
exports.getBySlug   = getBySlug;