'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    CommentBl = require('../bl/comment.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {
    function cb(err, pick){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pick);
        }
    }

    var event = req.event;
    CommentBl.getByEvent(event, cb);
}

function create(req, res){

    function cb(err, comment){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(comment);
        }
    }

    var event = req.event;

    CommentBl.createEventComment(req.body.text, event, req.user, cb);
}

function update(req, res){

    function cb(err, comment){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(comment);
        }
    }

    var comment = req.comment;
    var event = req.event;
    var user = req.user;
    var text = req.body.text;
    var replyIndex = req.body.replyIndex;

    CommentBl.eventCommentReply(comment, event, user, text, replyIndex, cb);

}

exports.get  = get;
exports.create  = create;
exports.update  = update;