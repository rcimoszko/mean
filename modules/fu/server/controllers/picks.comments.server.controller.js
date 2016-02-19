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

    var pick = req.pick;
    CommentBl.getByPick(pick, cb);
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

    var pick = req.pick;

    CommentBl.createPickComment(req.body.text, pick, req.user, cb);

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
    var pick = req.pick;
    var user = req.user;
    var text = req.body.text;
    var replyIndex = req.body.replyIndex;
    var replyUser = req.body.replyUser;

    CommentBl.pickCommentReply(comment, pick, user, text, replyIndex, replyUser, cb);
}

exports.get  = get;
exports.create  = create;
exports.update  = update;