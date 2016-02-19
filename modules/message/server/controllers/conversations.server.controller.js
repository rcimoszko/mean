'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    ConversationBl = require('../bl/conversation.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));


function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Conversation Id is invalid'
        });
    }

    function cb (err, conversation){
        if (err) return next(err);
        if (!conversation) {
            return res.status(404).send({
                message: 'Conversation not found'
            });
        }
        req.conversation = conversation;
        next();
    }

    ConversationBl.get(id, cb);
}

function get(req, res) {
    function cb(err, conversation){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(conversation);
        }
    }

    var conversation = req.conversation;
    var user = req.user;

    ConversationBl.getConversation(user, conversation, cb);
}



exports.get        = get;
exports.byId       = byId;