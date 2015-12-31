'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    GroupBl = require('../bl/group.server.bl');


function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Group Id is invalid'
        });
    }

    function cb (err, group){
        if (err) return next(err);
        if (!group) {
            return res.status(404).send({
                message: 'Group not found'
            });
        }
        req.group = group;
        next();
    }

    GroupBl.get(id, cb);
}

function getAll(req, res, next){
    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb (err, groups){
        if (err) return next(err);
        if (!groups) {
            return res.status(404).send({
                message: 'Groups not found'
            });
        }
        res.json(groups);
    }


    GroupBl.getByQuery(req.query, cb);

}

function get(req, res, next){
    res.json(req.group);
}

function update(req, res, next){
    function cb (err,group){
        if (err) return next(err);
        if (!group) {
            return res.status(500).send({
                message: 'Failed to update Group'
            });
        }
        res.json(group);

    }

    var group = req.group;
    var data = req.body;
    GroupBl.update(data, group, cb);
}

function del(req, res, next){

    function cb (err, group){
        if (err) return next(err);
        if (!group) {
            return res.status(500).send({
                message: 'Failed to delete Group'
            });
        }
        res.json(group);
    }

    var group = req.group;
    GroupBl.delete(group, cb);

}

exports.byId    = byId;
exports.getAll  = getAll;
exports.get     = get;
exports.update  = update;
exports.delete  = del;