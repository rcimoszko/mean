'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    PinnacleContestant = mongoose.model('PinnacleContestant');

function populate(pinnacleContestant, callback){

}

function get(id, callback){

    function cb(err, pinnacleContestant){
        callback(err, pinnacleContestant);
    }

    PinnacleContestant.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, pinnacleContestants){
        callback(err, pinnacleContestants);
    }

    PinnacleContestant.find().exec(cb);

}

function update(data, pinnacleContestant, callback) {

    function cb(err, pinnacleContestant){
        callback(err, pinnacleContestant);
    }

    pinnacleContestant = _.extend(pinnacleContestant, data);

    pinnacleContestant.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, pinnacleContestant);
    }

    var pinnacleContestant = new PinnacleContestant(data);

    pinnacleContestant.save(cb);
}

function del(pinnacleContestant, callback){

    function cb(err){
        callback(err, pinnacleContestant);
    }

    pinnacleContestant.remove(cb);
}

function getBySport(pinnacleSport, callback){
    function cb(err, pinnacleContestants){
        callback(err, pinnacleContestants);
    }

    PinnacleContestant.find({'pinnacleSport.ref':pinnacleSport}, cb);
}

function getByLeague(pinnacleLeague, callback){

    function cb(err, pinnacleContestants){
        callback(err, pinnacleContestants);
    }

    PinnacleContestant.find({'pinnacleLeague.ref':pinnacleLeague}, cb);
}



exports.populate    = populate;
exports.get         = get;
exports.getAll      = getAll;
exports.create      = create;
exports.update      = update;
exports.delete      = del;

exports.getBySport  = getBySport;
exports.getByLeague = getByLeague;