
'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    AdminService = require('../services/admin.server.service');


function get(req, res, next){
    function cb (err){
        if (err) {
            return res.status(400).send({
                message: err
            });
        }
        res.json('done');
    }

    AdminService.checkTrial(cb);
}


exports.get     = get;