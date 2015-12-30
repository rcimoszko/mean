'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    ContestantBl = require('../../../fu/server/bl/contestant.server.bl'),
    SportsbookBl = require('../../../fu/server/bl/sportsbook.server.bl'),
    PinnacleContestant = mongoose.model('PinnacleContestant');

function populate(pinnacleContestant, callback){

}

function get(id, callback){

    function cb(err, pinnacleContestant){
        callback(err, pinnacleContestant);
    }

    PinnacleContestant.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, pinnacleContestants){
        callback(err, pinnacleContestants);
    }

    PinnacleContestant.find().exec(cb);

}

function update(data, pinnacleContestant, callback) {

    function cb(err, pinnacleContestant){
        callback(err, pinnacleContestant);
    }

    pinnacleContestant = _.extend(pinnacleContestant, data);

    pinnacleContestant.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, pinnacleContestant);
    }

    var pinnacleContestant = new PinnacleContestant(data);

    pinnacleContestant.save(cb);
}

function del(pinnacleContestant, callback){

    function cb(err){
        callback(err, pinnacleContestant);
    }

    pinnacleContestant.remove(cb);
}

function getBySport(pinnacleSport, callback){
    function cb(err, pinnacleContestants){
        callback(err, pinnacleContestants);
    }

    PinnacleContestant.find({'pinnacleSport.ref':pinnacleSport}, cb);
}

function getByLeague(pinnacleLeague, callback){

    function cb(err, pinnacleContestants){
        callback(err, pinnacleContestants);
    }

    PinnacleContestant.find({'pinnacleLeague.ref':pinnacleLeague}, cb);
}

function getOneByQuery(query, callback){
    PinnacleContestant.findOne(query, callback);
}

function autoCreate(pinnacleContestant, pinnacleLeague, callback){
    var todo = [];

    function getPinnacleSportsbook(callback){
        SportsbookBl.getPinnacle(callback);
    }

    function createContestant(pinnacleSportsbook, callback){
        var contestant = {
            name: pinnacleContestant.name,
            sport: {name: pinnacleLeague.sport.name, ref: pinnacleLeague.sport.ref},
            auto: true,
            origin: {name: pinnacleSportsbook.name, ref: pinnacleSportsbook._id}
        };

        if(pinnacleLeague.league){
            contestant.leagues = [{name: pinnacleLeague.league.name, ref: pinnacleLeague.league.ref}];
        }
        ContestantBl.create(contestant, callback);
    }

    function updatePinnacleContestant(contestant, callback){
        pinnacleContestant.contestant = {name: contestant.name, ref: contestant._id};
        callback(null, pinnacleContestant);
    }

    todo.push(getPinnacleSportsbook);
    todo.push(createContestant);
    todo.push(updatePinnacleContestant);

    async.waterfall(todo, callback);
}

function findOrCreate(name, pinnacleLeague, callback){
    var todo = [];

    function findContestant(callback){
        var query = {name: { $regex: new RegExp('^'+name+'$', 'i')}, 'pinnacleLeague.ref': pinnacleLeague._id };
        getOneByQuery(query, callback);
    }

    function createContestant(pinnacleContestant, callback){
        if(pinnacleContestant) return callback(null, pinnacleContestant);

        var todo = [];

        function findSimilarContestant(callback){
            var query = {
                        $or:        [{otherNames:{ $regex: new RegExp('^'+name+'$', 'i')}},
                                     {name: { $regex: new RegExp('^'+name+'$', 'i')}}],
                        'sport.ref': pinnacleLeague.sport.ref
                        };

            function cb(err ,contestant){
                callback(err, contestant);
            }

            ContestantBl.getOneByQuery(query, cb);

        }

        function updateOrCreateContestant(contestant, callback){

            var pinnacleContestant = {
                name: name,
                pinnacleSport: {name: pinnacleLeague.pinnacleSport.name, ref: pinnacleLeague.pinnacleSport.ref},
                pinnacleLeague: {name: pinnacleLeague.name, ref: pinnacleLeague._id}
            };

            if(contestant){
                pinnacleContestant.contestant = {name: contestant.name, ref: contestant._id};
                pinnacleContestant.autoMatched = true;
                callback(null, pinnacleContestant);
            } else {
                autoCreate(pinnacleContestant, pinnacleLeague, callback);
            }
        }

        function saveContestant(pinnacleContestant, callback){
            create(pinnacleContestant, callback);
        }

        todo.push(findSimilarContestant);
        todo.push(updateOrCreateContestant);
        todo.push(saveContestant);

        async.waterfall(todo, callback);

    }

    todo.push(findContestant);
    todo.push(createContestant);

    async.waterfall(todo, callback);

}



exports.populate    = populate;
exports.get         = get;
exports.getAll      = getAll;
exports.create      = create;
exports.update      = update;
exports.delete      = del;

exports.getBySport  = getBySport;
exports.getByLeague = getByLeague;

exports.findOrCreate = findOrCreate;