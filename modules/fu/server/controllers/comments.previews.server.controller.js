
'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    CommentsPreviewsBl = require('../bl/comment.previews.server.bl');


function get(req, res, next){
    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb (err, comments){
        if (err) return next(err);
        if (!comments) {
            return res.status(404).send({
                message: 'Invalid query'
            });
        }
        res.json(comments);
    }

    CommentsPreviewsBl.getPreviews(req.query, cb);
}


exports.get     = get;