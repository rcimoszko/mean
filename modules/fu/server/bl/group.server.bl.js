'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Group = mongoose.model('Group');

function populate(group, callback){

}

function get(id, callback){

    function cb(err, group){
        callback(err, group);
    }

    Group.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, groups){
        callback(err, groups);
    }

    Group.find().exec(cb);

}

function update(data, group, callback) {

    function cb(err){
        callback(err, group);
    }

    group = _.extend(group, data);

    group.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, group);
    }

    var group = new Group(data);

    group.save(cb);
}

function del(group, callback){

    function cb(err){
        callback(err, group);
    }

    group.remove(cb);
}

function getByQuery(query, callback){
    Group.find(query, callback);
}

function getOneByQuery(query, callback){
    Group.findOne(query, callback);
}

function getBySport(sport, callback){
    getByQuery({'sport.ref':sport}, callback);
}


exports.populate    = populate;
exports.getAll      = getAll;
exports.get         = get;
exports.create      = create;
exports.update      = update;
exports.delete      = del;

exports.getByQuery  = getByQuery;
exports.getBySport  = getBySport;
exports.getOneByQuery = getOneByQuery;