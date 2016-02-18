'use strict';

var path = require('path'),
    ConversationBl = require('../bl/conversation.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {
    function cb(err, conversations){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(conversations);
        }
    }

    var user = req.user;

    ConversationBl.getByUser(user, cb);
}

function create(req, res) {
    function cb(err, conversation){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(conversation);
        }
    }

    var data = req.body;
    var user = req.user;

    ConversationBl.createConversation(data, user, cb);
}


exports.get        = get;
exports.create     = create;