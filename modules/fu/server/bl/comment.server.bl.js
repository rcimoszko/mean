'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    m_Comment = mongoose.model('Comment');

function populate(contestant, callback){

}

function get(id, callback){

    function cb(err, contestant){
        callback(err, contestant);
    }

    m_Comment.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, contestants){
        callback(err, contestants);
    }

    m_Comment.find().exec(cb);

}

function update(data, contestant, callback) {

    function cb(err){
        callback(err, contestant);
    }

    contestant = _.extend(contestant, data);

    contestant.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, contestant);
    }

    var contestant = new m_Comment(data);

    contestant.save(cb);
}

function del(contestant, callback){

    function cb(err){
        callback(err, contestant);
    }

    contestant.remove(cb);
}

function getByQuery(query, callback){
    m_Comment.find(query, callback);
}

function getBySport(sport, callback){
    getByQuery({sport:sport}, callback);
}

function getByLeague(league, callback){
    getByQuery({league:league}, callback);
}

function getByEvent(event, callback){
    getByQuery({event:event}, callback);
}

function getByPick(pick, callback){
    getByQuery({pick:pick}, callback);
}

exports.populate    = populate;
exports.getAll      = getAll;
exports.get         = get;
exports.create      = create;
exports.update      = update;
exports.delete      = del;
exports.getByQuery  = getByQuery;

exports.getBySport   = getBySport;
exports.getByLeague  = getByLeague;
exports.getByEvent   = getByEvent;
exports.getByPick    = getByPick;