'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    CommentBl = require('../bl/comment.server.bl');


function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Comment Id is invalid'
        });
    }

    function cb (err, comment){
        if (err) return next(err);
        if (!comment) {
            return res.status(404).send({
                message: 'Comment not found'
            });
        }
        req.comment = comment;
        next();
    }

    CommentBl.get(id, cb);
}

function getAll(req, res, next){
    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb (err, comments){
        if (err) return next(err);
        if (!comments) {
            return res.status(404).send({
                message: 'Comments not found'
            });
        }
        res.json(comments);
    }


    CommentBl.getByQuery(req.query, cb);

}

function get(req, res, next){
    res.json(req.comment);
}

function update(req, res, next){
    function cb (err,comment){
        if (err) return next(err);
        if (!comment) {
            return res.status(500).send({
                message: 'Failed to update Comment'
            });
        }
        res.json(comment);

    }

    var comment = req.comment;
    var json = req.body;
    CommentBl.update(comment, json, cb);
}

function del(req, res, next){

    function cb (err, comment){
        if (err) return next(err);
        if (!comment) {
            return res.status(500).send({
                message: 'Failed to delete Comment'
            });
        }
        res.json(comment);
    }

    var comment = req.comment;
    CommentBl.delete(comment, cb);

}

exports.byId    = byId;
exports.getAll  = getAll;
exports.get     = get;
exports.update  = update;
exports.delete  = del;