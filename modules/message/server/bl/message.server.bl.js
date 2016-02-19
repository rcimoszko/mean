'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    Message = mongoose.model('Message');

function get(id, callback){

    function cb(err, message){
        callback(err, message);
    }

    Message.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, messages){
        callback(err, messages);
    }

    Message.find().exec(cb);

}

function create(data, callback) {

    function cb(err){
        callback(err, message);
    }

    var message = new Message(data);

    message.save(cb);
}

function getByQuery(query, callback){
    Message.find(query, callback);
}
function getOneByQuery(query, callback){
    Message.findOne(query, callback);
}

function getByConversation(conversationId, callback){
    getByQuery({'conversation':conversationId}, callback);
}


exports.getAll      = getAll;
exports.get         = get;
exports.create      = create;
exports.getByQuery  = getByQuery;

exports.getByConversation   = getByConversation;