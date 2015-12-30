'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    PinnacleSport = mongoose.model('PinnacleSport');

function populate(pinnacleSport, callback){

}

function get(id, callback){

    function cb(err, pinnacleSport){
        callback(err, pinnacleSport);
    }

    PinnacleSport.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, pinnacleSports){
        callback(err, pinnacleSports);
    }

    PinnacleSport.find().exec(cb);

}

function update(data, pinnacleSport, callback) {

    function cb(err, pinnacleSport){
        callback(err, pinnacleSport);
    }

    pinnacleSport = _.extend(pinnacleSport, data);

    pinnacleSport.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, pinnacleSport);
    }

    var pinnacleSport = new PinnacleSport(data);

    pinnacleSport.save(cb);
}

function del(pinnacleSport, callback){

    function cb(err){
        callback(err, pinnacleSport);
    }

    pinnacleSport.remove(cb);
}

function getByQuery(query, callback){
    PinnacleSport.find(query, callback);
}

function getOneByQuery(query, callback){
    PinnacleSport.findOne(query, callback);
}


exports.populate    = populate;
exports.get         = get;
exports.getAll      = getAll;
exports.create      = create;
exports.update      = update;
exports.delete      = del;

exports.getByQuery     = getByQuery;
exports.getOneByQuery  = getOneByQuery;