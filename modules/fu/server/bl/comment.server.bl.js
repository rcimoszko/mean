'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    m_Comment = mongoose.model('Comment');

function populate(comment, callback){

}

function get(id, callback){

    function cb(err, comment){
        callback(err, comment);
    }

    m_Comment.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, comments){
        callback(err, comments);
    }

    m_Comment.find().exec(cb);

}

function update(data, comment, callback) {

    function cb(err){
        callback(err, comment);
    }

    comment = _.extend(comment, data);

    comment.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, comment);
    }

    var comment = new m_Comment(data);

    comment.save(cb);
}

function del(comment, callback){

    function cb(err){
        callback(err, comment);
    }

    comment.remove(cb);
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


function populateBy(comments, populate, callback){
    m_Comment.populate(comments, populate, callback);
}

function getPreviews(query, count, callback){
    m_Comment.find(query).sort({timestamp:-1}).limit(count)
        .populate('sport', 'name')
        .populate('league', 'name')
        .populate('event', 'contestant1 contestant2 slug commentCount')
        .populate('pick')
        .exec(callback);
}

exports.populate    = populate;
exports.getAll      = getAll;
exports.get         = get;
exports.create      = create;
exports.update      = update;
exports.delete      = del;
exports.getByQuery  = getByQuery;
exports.populateBy  = populateBy;

exports.getPreviews  = getPreviews;

exports.getBySport   = getBySport;
exports.getByLeague  = getByLeague;
exports.getByEvent   = getByEvent;
exports.getByPick    = getByPick;