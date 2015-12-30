'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    PinnacleContestant = mongoose.model('PinnacleContestant'),
    Pick = mongoose.model('Pick'),
    Contestant = mongoose.model('Contestant');

function populate(contestant, callback){

}

function get(id, callback){

    function cb(err, contestant){
        callback(err, contestant);
    }

    Contestant.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, contestants){
        callback(err, contestants);
    }

    Contestant.find().exec(cb);

}

function update(data, contestant, callback) {

    function cb(err){
        callback(err, contestant);
    }

    contestant = _.extend(contestant, data);

    contestant.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, contestant);
    }

    var contestant = new Contestant(data);

    contestant.save(cb);
}

function del(contestant, callback){

    function cb(err){
        callback(err, contestant);
    }

    contestant.remove(cb);
}

function getByQuery(query, callback){
    Contestant.find(query, callback);
}

function getOneByQuery(query, callback){
    Contestant.findOne(query, callback);
}

function merge(mainContestant, contestantsToMerge, callback){

    function mergeEach(mergeContestant, callback){
        var todo = [];

        function addOtherName(callback){
            Contestant.update({_id:mainContestant._id}, {$addToSet:{otherNames: mergeContestant.name}}, callback);
        }

        function addLeagues(callback){
            function addLeague(league, callback){
                var update = {$addToSet:{leagues: league}};
                Contestant.update({_id:mainContestant._id}, update, callback);
            }
            async.each(mergeContestant.leagues, addLeague, callback);
        }

        function updatePinnacleContestant(callback){
            var update = {$set: {contestant:{name: mainContestant.name, ref: mainContestant._id}}};
            PinnacleContestant.update({'contestant.ref': mergeContestant._id}, update, {multi:true}, callback);
        }

        function updatePicks(callback){
            var update = {$set: {contestant:{name: mainContestant.name, ref: mainContestant._id}}};
            Pick.update({'contestant.ref': mergeContestant._id}, update, {multi: true}, callback);
        }

        function updateEvents(callback){
            var contestantNos = [1,2];

            async.eachSeries(contestantNos, function(contestantNo, callback){

                var query = {};
                query['contestant'+contestantNo+'.ref'] = mergeContestant._id;

                Event.find(query).exec(function(err, events){

                    async.eachSeries(events, function(event, callback){

                        event['contestant'+contestantNo].name = mainContestant.name;
                        event['contestant'+contestantNo].ref = mainContestant._id;

                        async.eachSeries(event.betsAvailable, function(bet, callback){
                            if(bet.contestant.ref && String(bet.contestant.ref) === String(mergeContestant._id)){
                                bet.contestant.name = mainContestant.name;
                                bet.contestant.ref = mainContestant._id;
                            }
                            callback();
                        }, function(err){
                            event.save(function(err){
                                callback(err);
                            });
                        });

                    }, function(err){
                        callback(err);
                    });
                });
            }, function(err){
                callback(err);
            });

        }
        function removeContestant(callback){
            Contestant.remove({_id:mergeContestant._id }, callback);
        }

        todo.push(addOtherName);
        todo.push(addLeagues);
        todo.push(updatePinnacleContestant);
        todo.push(updatePicks);
        todo.push(updateEvents);
        todo.push(removeContestant);

        async.waterfall(todo, callback);
    }

    async.each(contestantsToMerge, mergeEach, callback);
}



exports.populate    = populate;
exports.getAll      = getAll;
exports.get         = get;
exports.create      = create;
exports.update      = update;
exports.delete      = del;
exports.getByQuery  = getByQuery;
exports.getOneByQuery  = getOneByQuery;

exports.merge       = merge;