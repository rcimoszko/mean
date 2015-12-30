'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    PinnacleLeague = mongoose.model('PinnacleLeague');

function populate(pinnacleLeague, callback){

}

function get(id, callback){

    function cb(err, pinnacleLeague){
        callback(err, pinnacleLeague);
    }

    PinnacleLeague.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, pinnacleLeagues){
        callback(err, pinnacleLeagues);
    }

    PinnacleLeague.find().exec(cb);

}

function update(data, pinnacleLeague, callback) {

    function cb(err, pinnacleLeague){
        callback(err, pinnacleLeague);
    }

    pinnacleLeague = _.extend(pinnacleLeague, data);

    pinnacleLeague.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, pinnacleLeague);
    }

    var pinnacleLeague = new PinnacleLeague(data);

    pinnacleLeague.save(cb);
}

function del(pinnacleLeague, callback){

    function cb(err){
        callback(err, pinnacleLeague);
    }

    pinnacleLeague.remove(cb);
}

function getBySport(pinnacleSport, callback){

    function cb(err, pinnacleLeagues){
        callback(err, pinnacleLeagues);
    }

    PinnacleLeague.find({'pinnacleSport.ref':pinnacleSport}, cb);
}

function getByQuery(query, callback){
    PinnacleLeague.find(query, callback);
}

function getOneByQuery(query, callback){
    PinnacleLeague.findOne(query, callback);
}

exports.populate    = populate;
exports.get         = get;
exports.getAll      = getAll;
exports.create      = create;
exports.update      = update;
exports.delete      = del;

exports.getBySport    = getBySport;
exports.getOneByQuery = getOneByQuery;
exports.getByQuery    = getByQuery;