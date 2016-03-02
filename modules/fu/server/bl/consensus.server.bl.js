'use strict';

var _ = require('lodash'),
    async = require('async'),
    PickBl = require('./pick.server.bl'),
    BetBl = require('./bet.server.bl'),
    EventBl = require('./event.server.bl'),
    mongoose = require('mongoose');


function getConsensus(sportId, leagueId, count, callback){
    var todo = [];

    function groupPicks(callback){
        var query =  {result: 'Pending', betType: 'moneyline'};
        if(sportId !== 'all') query.sport = mongoose.Types.ObjectId(sportId);
        if(leagueId !== 'all') query.league = mongoose.Types.ObjectId(leagueId);
        var match = {$match: query};
        var group = {$group: {'_id':  '$event', picks: {$addToSet: '$$ROOT'}, pickCount:{$sum:1}}};
        var sort =  {$sort: {'eventStartTime': -1}};

        var aggArray = [];
        aggArray.push(match);
        aggArray.push(group);
        aggArray.push(sort);

        PickBl.aggregate(aggArray, callback);
    }

    function filterEvents(events, callback){
        events = _.filter(events, function(event){
            return event.pickCount > 3;
        });
        callback(null, events);
    }

    function populateEvents(events, callback){
        var populate = {path: '_id', model:'Event'};
        PickBl.populateBy(events, populate, callback);
    }

    function populateEventsLeagues(events, callback){
        var populate = [{path: '_id.league.ref', model:'League'}];
        EventBl.populateBy(events, populate, callback);
    }

    function calculateConsensus(events, callback){

        function processEvent(event, callback){
            var contestantGroup = _.groupBy(event.picks, 'contestant.ref');
            for(var num = 1; num <= 2;num++ ){
                var contestantId = event._id['contestant'+num].ref;
                if(contestantGroup[contestantId]){
                    event['contestant'+num+'Count'] = contestantGroup[contestantId].length;
                } else {
                    event['contestant'+num+'Count'] = 0;
                }
                event.contestant1Consensus = (event.contestant1Count/event.pickCount)*100;
                event.contestant2Consensus = (event.contestant2Count/event.pickCount)*100;
                if(event.contestant1Consensus > event.contestant2Consensus){
                    event.maxConsensus = event.contestant1Consensus.toFixed(0);
                    event.contestantNum = 1;
                } else if( event.contestant2Consensus > event.contestant1Consensus){
                    event.maxConsensus = event.contestant2Consensus.toFixed(0);
                    event.contestantNum = 2;
                } else {
                    event.contestantNum = 1;
                    event.maxConsensus = 50;
                }
            }
            callback();

        }

        function cb(err){
            callback(err, events);
        }

        async.each(events, processEvent, cb);
    }

    function filterConsensusData(events, callback){
        events = _.sortBy(events, function(event){
            return -1*event.maxConsensus;
        });
        events = events.splice(0, count);
        callback(null, events);
    }

    function cleanConsensusData(events, callback){
        var consensusResults = [];

        function cleanData(event, callback){
            var todo = [];

            function getBet(callback){
                var query = {
                        betType: 'moneyline',
                        event: event._id._id,
                        'contestant.ref': event._id['contestant'+event.contestantNum].ref
                    };

                var populate = {path: 'contestant.ref', model: 'Contestant'};
                BetBl.getOneAndPopulate(query, populate, callback);
            }

            function createConsensus(bet, callback){
                var consensus = {
                    event: event._id,
                    bet: bet,
                    pick:{
                        contestant: bet.contestant.name,
                        league: event._id.league.name,
                        percent: event.maxConsensus,
                        logoUrl: bet.contestant.ref.logoUrl
                    }
                };
                consensusResults.push(consensus);
                callback();
            }

            todo.push(getBet);
            todo.push(createConsensus);

            async.waterfall(todo, callback);

        }

        function cb(err){
            callback(err, consensusResults);
        }

        async.eachSeries(events, cleanData, cb);
    }

    todo.push(groupPicks);
    todo.push(filterEvents);
    todo.push(populateEvents);
    todo.push(populateEventsLeagues);
    todo.push(calculateConsensus);
    todo.push(filterConsensusData);
    todo.push(cleanConsensusData);

    async.waterfall(todo, callback);
}


exports.getConsensus = getConsensus;

