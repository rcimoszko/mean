'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    HistoricalValue = mongoose.model('HistoricalValue'),
    HistoricalValues = mongoose.model('HistoricalValues');

function populate(historicalValues, callback){

}

function get(id, callback){

    function cb(err, historicalValues){
        callback(err, historicalValues);
    }

    HistoricalValues.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, historicalValuess){
        callback(err, historicalValuess);
    }

    HistoricalValues.find().exec(cb);

}

function update(data, historicalValues, callback) {

    function cb(err){
        callback(err, historicalValues);
    }

    historicalValues = _.extend(historicalValues, data);
    historicalValues.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, historicalValues);
    }

    var newHistoricalValue = new HistoricalValue({value: data.value});
    var historicalValues = new HistoricalValues({bet: data.bet, type: data.type, values: [newHistoricalValue]});

    historicalValues.save(cb);
}

function del(historicalValues, callback){
    function cb(err){
        callback(err, historicalValues);
    }

    historicalValues.remove(cb);
}

function getByQuery(query, callback){
    HistoricalValues.find(query, callback);
}

function getOneByQuery(query, callback){
    HistoricalValues.findOne(query, callback);
}

function add(bet, type, value, callback){
    var historicalValue = new HistoricalValue({value:value});
    HistoricalValues.update({bet: bet._id, type:type}, {$push: {values: historicalValue}}, callback);
}

exports.populate    = populate;
exports.get         = get;
exports.getAll      = getAll;
exports.create      = create;
exports.update      = update;
exports.delete      = del;
exports.add         = add;
