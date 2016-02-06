'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    Channel = mongoose.model('Channel');

function populate(channel, callback){

}

function get(id, callback){

    function cb(err, channel){
        callback(err, channel);
    }

    Channel.findById(id).exec(cb);
}

function getBySlug(slug, callback){

    function cb(err, channel){
        callback(err, channel);
    }

    Channel.findOne({slug:slug}).exec(cb);
}

function getAll(callback){

    function cb(err, channels){
        callback(err, channels);
    }

    Channel.find().exec(cb);

}

function update(data, channel, callback) {

    function cb(err){
        callback(err, channel);
    }

    channel = _.extend(channel, data);

    channel.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, channel);
    }

    var channel = new Channel(data);

    channel.save(cb);
}

function del(channel, callback){

    function cb(err){
        callback(err, channel);
    }

    channel.remove(cb);
}

function getByQuery(query, callback){
    Channel.find(query, callback);
}
function getOneByQuery(query, callback){
    Channel.findOne(query, callback);
}

function getBySport(sport, callback){
    getByQuery({'sport.ref':sport}, callback);
}

function getByLeague(league, callback){
    getByQuery({'league.ref':league}, callback);
}

function getByGroup(group, callback){
    getByQuery({'group.ref':group}, callback);
}


exports.populate    = populate;
exports.getAll      = getAll;
exports.get         = get;
exports.getBySlug   = getBySlug;
exports.create      = create;
exports.update      = update;
exports.delete      = del;
exports.getByQuery  = getByQuery;
exports.getOneByQuery   = getOneByQuery;

exports.getBySport   = getBySport;
exports.getByLeague  = getByLeague;
exports.getByGroup   = getByGroup;