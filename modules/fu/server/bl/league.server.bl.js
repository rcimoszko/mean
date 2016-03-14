'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    League = mongoose.model('League');

function populate(league, callback){

}

function get(id, callback){

    function cb(err, league){
        callback(err, league);
    }

    League.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, leagues){
        callback(err, leagues);
    }

    League.find().exec(cb);

}

function update(data, league, callback) {

    function cb(err){
        callback(err, league);
    }

    league = _.extend(league, data);

    league.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, league);
    }

    var league = new League(data);

    league.save(cb);
}

function del(league, callback){

    function cb(err){
        callback(err, league);
    }

    league.remove(cb);
}

function getByQuery(query, callback){
    League.find(query, callback);
}

function getOneByQuery(query, callback){
    League.findOne(query, callback);
}

function getBySport(sport, callback){
    League.find({'sport.ref':sport._id}, callback);
}


function getBySlug(slug, callback){

    function cb(err, event){
        callback(err, event);
    }

    League.findOne({slug:slug}).exec(cb);
}

function getEsportsGroupName(leagueName){
    //starcraft, dota 2, cs:go, league of legends
    var groupNames = {
        'starcraft 2':          ['starcraft'],
        'dota 2':               ['dota'],
        'cs:go':                ['cs:go', 'counter'],
        'league of legends':    ['league of', 'lol']
    };

    for(var groupName in groupNames){
        var names = groupNames[groupName];
        for(var i= 0;i<names.length; i++){
            if(leagueName.toLowerCase().indexOf(names[i]) !== -1){
                return groupName;
            }
        }
    }

}

exports.populate    = populate;
exports.getAll      = getAll;
exports.get         = get;
exports.create      = create;
exports.update      = update;
exports.delete      = del;

exports.getByQuery  = getByQuery;
exports.getOneByQuery  = getOneByQuery;
exports.getBySport  = getBySport;
exports.getBySlug  = getBySlug;

exports.getEsportsGroupName = getEsportsGroupName;