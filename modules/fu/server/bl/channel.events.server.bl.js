'use strict';

var _ = require('lodash'),
    EventBl = require('./event.server.bl'),
    PickBl = require('./pick.server.bl'),
    async = require('async');


/*
 [
 {
    date:
    events: [
         {
         contestant1
         contestant2
         startTime
         slug
         proPicks: {

         }
         picks: {

         },
         pickCount: {

         },
         proPickCount: {

         }
    }
    ]
 }
 ]


 */

function processOverEvent(event, pEvent, picks, user, callback){

    var todo = [];

    function getScores(callback){

    }

    function getClosingLines(callback){

    }

    function getProPickStats(callback){

    }

    function getGeneralStats(callback){

    }

    todo.push(getScores);
    todo.push(getClosingLines);
    todo.push(getProPickStats);
    todo.push(getGeneralStats);

    async.waterfall(todo, callback);

}


function processPendingEvent(event, pEvent, picks, user, callback){

    var todo = [];

    function getLines(callback){
        var mainBetType = ['moneyline', 'spread', 'total points'];
        var mainBetDuration = ['match', 'game', 'fight', 'matchups'];

        var bets = _.filter(event.pinnacleBets, function(bet){
            return !bet.altLine && mainBetType.indexOf(bet.betType) !== -1 && mainBetDuration.indexOf(bet.betDuration) !== -1;
        });

        bets = _.groupBy(bets, 'betType');

        for (var betType in bets){
            bets[betType] = _.groupBy(bets[betType], 'contestant.ref');
        }

        pEvent.odds = bets;
        pEvent.oddsColumns = Object.keys(bets).length;
        pEvent.oddsColumnsOrder = _.sortBy(Object.keys(bets), function(betType){
            return mainBetType.indexOf(betType);
        });
        callback();

    }

    function getProPicks(callback){
        var proPicks = _.filter(picks, {premium: true});
        pEvent.picks = proPicks.splice(0,3);
        callback();
    }


    function getGeneralPicks(callback){
        if(pEvent.picks.length < 3){
            var generalPicks = _.filter(picks, {premium: false});
            pEvent.picks = pEvent.picks.concat(generalPicks.splice(0,3-pEvent.picks.length));
        }
        callback();
    }

    function hideProPicks(callback){
        for(var i=0; i<pEvent.picks; i++){
            if(String(pEvent.picks[i].user.ref._id) !== String(user._id)){
                if(pEvent.picks[i].premium && !user.premium){
                    pEvent.picks[i] = {hidden: true};
                }
            }
        }
        callback();
    }


    todo.push(getLines);
    todo.push(getProPicks);
    todo.push(getGeneralPicks);
    todo.push(hideProPicks);

    async.waterfall(todo, callback);

}


function getDateQuery(dateGroup, date){
    var timeIntervalStart;
    var timeIntervalEnd;
    var today = new Date();
    if(date){
        timeIntervalStart = new Date(date);
        timeIntervalEnd = new Date(date);
        timeIntervalEnd.setDate(timeIntervalStart.getDate()+1);
    } else{
        switch(dateGroup){
            case 'weekly':
            case 'daily':
                timeIntervalStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0);
                timeIntervalEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1, 0, 0);
                break;
            default: //upcoming
                timeIntervalStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0);
                break;
        }
    }

    var query = {};
    if(timeIntervalEnd){
        query = {$lte: timeIntervalEnd, $gte: timeIntervalStart};
    } else {
        query = { $gte: timeIntervalStart};
    }

    return query;
}


function get(channel, user, date, callback){

    var todo = [];

    function getEvents(callback) {
        var dateQuery = getDateQuery(channel.dateGroup, date);
        var query = {startTime: dateQuery};
        if(channel.type === 'sport') query['sport.ref'] = channel.sport.ref;
        if(channel.type === 'league') query['league.ref'] = channel.league.ref;
        EventBl.getByQuery(query, callback);
    }


    function populateBets(events, callback) {
        var populate = [{path: 'pinnacleBets', model: 'Bet'},
                        {path:'contestant1.ref', model: 'Contestant'},
                        {path:'contestant2.ref', model: 'Contestant'}];

        EventBl.populateBy(events, populate, callback);
    }

    function getPicks(events, callback){
        var eventIdArray = _.chain(events).pluck('_id').value();
        var query = {event: {$in: eventIdArray}};
        function cb(err, picks){
            callback(err, events, picks);
        }
        PickBl.getByQuery(query, cb);

    }

    function processEvents(events, picks, callback){
        var processedEvents = [];

        function processEvent(event, callback){
            var pEvent = {
                sport: event.sport,
                league: event.league,
                contestant1: event.contestant1.ref,
                contestant2: event.contestant2.ref,
                slug: event.slug,
                over: event.over,
                startTime: event.startTime,
                commentCount: event.commentCount
            };

            function cb(err){
                processedEvents.push(pEvent);
                callback(err);
            }
            var eventPicks = _.filter(picks, function(pick){ //TO CHANGE WHEN CHANGE PickBL.getByQuery to not include event populate
                return String(pick.event._id) === String(event._id);
            });

            if(event.over) processOverEvent(event, pEvent, eventPicks, user,  cb);
            if(!event.over) processPendingEvent(event, pEvent, eventPicks, user, cb);
        }

        function cb(err){
            callback(err, processedEvents);
        }

        async.each(events, processEvent, cb);
    }

    function groupEventsByDay(events, callback){

        var eventsByDate = _.groupBy(events, function(event){
            var date = new Date(event.startTime);
            date.setHours(date.getHours()+7);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        });

        events = [];
        for(var date in eventsByDate){
            events.push({date:new Date(date), events:eventsByDate[date]});
        }

        events = _.sortBy(events, 'date');

        callback(null, events);
    }

    todo.push(getEvents);
    todo.push(populateBets);
    todo.push(getPicks);
    todo.push(processEvents);
    todo.push(groupEventsByDay);

    async.waterfall(todo, callback);

}


exports.get = get;