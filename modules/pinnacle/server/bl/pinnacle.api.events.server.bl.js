'use strict';

var mongoose = require('mongoose'),
    PinApiBl = require('./pinnacle.api.server.bl'),
    Event = mongoose.model('Event'),
    PinnacleSportBl = require('./pinnacleSport.server.bl'),
    PinnacleContestantBl = require('./pinnacleContestant.server.bl'),
    EventBl = require('../../../fu/server/bl/event.server.bl'),
    slug = require('speakingurl'),
    PinnacleLeagueBl = require('./pinnacleLeague.server.bl'),
    async = require('async');

var neutralSports = [
    'Tennis',
    'Cricket',
    'Mixed Martial Arts',
    'Cycling',
    'E Sports',
    'Formula 1',
    'Golf',
    'Snooker',
    'Table Tennis',
    'Alpine Skiing',
    'Badminton',
    'Bandy',
    'Curling',
    'Darts',
    'Darts (Legs)',
    'Floorball',
    'Horse Racing',
    'Other Sports',
    'Politics',
    'Softball',
    'Squash',
    'Volleyball (Points)',
    'Water Polo',
    'Biathlon',
    'Ski Jumping',
    'Cross Country',
    'Formula 1',
    'Bobsleigh',
    'Figure Skating',
    'Freestyle Skiing',
    'Luge',
    'Nordic Combined',
    'Short Track',
    'Skeleton',
    'Snow Boarding',
    'Speed Skating'
];

function parseEventApi(eventApi, pinnacleLeague, callback){
    var event = {};
    event.pinnacleId = eventApi.id;
    event.contestant1Name = eventApi.home.replace(/ \(.*$/g, '');
    event.contestant2Name = eventApi.away.replace(/ \(.*$/g, '');
    event.contestant1RotNum = parseInt(eventApi.rotNum);
    event.startTime = new Date(eventApi.starts);

    if('homePitcher' in eventApi) event.contestant1Pitcher = eventApi.homePitcher;
    if('awayPitcher' in eventApi) event.contestant2Pitcher = eventApi.awayPitcher;

    event.neutral = eventApi.home.indexOf('(n)') !== -1 ||eventApi.away.indexOf('(n)') !== -1;
    if(pinnacleLeague.name.indexOf('OT Included') !== -1) event.type = 'ot included';
    if(pinnacleLeague.name.indexOf('Regular Time') !== -1) event.type = 'regular time';
    if(eventApi.home.indexOf('(+1.5 Sets)') !== -1) event.type = '+1.5 sets';
    if(eventApi.home.indexOf('(-1.5 Sets)') !== -1) event.type = '-1.5 sets';
    if(eventApi.home.indexOf('g1') !== -1 && eventApi.away.indexOf('g1') !== -1) event.gameNo = 1;
    if(eventApi.home.indexOf('g2') !== -1 && eventApi.away.indexOf('g2') !== -1) event.gameNo = 2;

    if(pinnacleLeague.pinnacleSport.name === 'E Sports'){
        var regExp = /\(.*/;
        var matches = regExp.exec(eventApi.home);
        if(matches){
            event.type = matches[0].replace('(', '');
            event.type = event.type.replace(')', '').toLowerCase();
        }
    }

    callback(null, event);
}


function createEvent(pinnacleLeague, eventData, callback){
    var todo = [];

    function getPinnacleContestants(callback){
        function getPinContestant1(callback){
            PinnacleContestantBl.findOrCreate(eventData.contestant1Name, pinnacleLeague, callback);
        }

        function getPinContestant2(callback){
            PinnacleContestantBl.findOrCreate(eventData.contestant2Name, pinnacleLeague, callback);
        }

        async.parallel({pinnacleContestant1:getPinContestant1, pinnacleContestant2:getPinContestant2}, callback);
    }
    function checkIfContestantsAreValid(contestants, callback){
        if(contestants.pinnacleContestant1.invalid || contestants.pinnacleContestant2.invalid) return callback('invalid contestants');
        callback(null, contestants);
    }

    function matchEvent(contestants, callback){
        if(!contestants.pinnacleContestant1.contestant || !contestants.pinnacleContestant2.contestant) return callback(null, contestants);
        if(!contestants.pinnacleContestant1.contestant.ref || !contestants.pinnacleContestant2.contestant.ref) return callback(null, contestants);

        var dateQueryEnd = new Date(eventData.startTime.getFullYear(), eventData.startTime.getMonth(), eventData.startTime.getDate()+1);
        var dateQueryStart = new Date(eventData.startTime.getFullYear(), eventData.startTime.getMonth(), eventData.startTime.getDate()-1);

        var query = {startTime: {$gte: dateQueryStart, $lt: dateQueryEnd},
            $or:[{'contestant1.ref': contestants.pinnacleContestant1.contestant.ref, 'contestant2.ref':contestants.pinnacleContestant2.contestant.ref},
                {'contestant1.ref': contestants.pinnacleContestant2.contestant.ref, 'contestant2.ref':contestants.pinnacleContestant1.contestant.ref}]};


        function cb(err, event){
            if(event){
                event.pinnacleIds.push(eventData.pinnacleId);
                if(eventData.type){
                    if(!event.pinnacleEventType) event.pinnacleEventType = {};
                    event.pinnacleEventType[eventData.pinnacleId] = eventData.type;
                    event.markModified('pinnacleEventType');
                }
                event.save();
                return callback('matched event');
            }
            callback(err, contestants);
        }

        EventBl.getOneByQuery(query, cb);
    }


    function createEvent(contestants, callback){
        var neutral = eventData.neutral;
        if(!neutral){
            if(neutralSports.indexOf(pinnacleLeague.sport.name) !== -1){
                neutral = true;
            }
        }

        var event = {
            sport: {name:pinnacleLeague.sport.name, ref:pinnacleLeague.sport.ref},
            league: {name:pinnacleLeague.league.name, ref:pinnacleLeague.league.ref},
            contestant1: {name: contestants.pinnacleContestant1.contestant.name, ref: contestants.pinnacleContestant1.contestant.ref, rotNum: eventData.contestant1RotNum},
            contestant2: {name: contestants.pinnacleContestant2.contestant.name, ref: contestants.pinnacleContestant2.contestant.ref},
            neutral: neutral,
            startTime: eventData.startTime
        };

        //Game number for baseball games
        if ('gameNo' in eventData){
            event.gameNo = eventData.gameNo;
        }
        if(eventData.type){
            var type = {};
            type[eventData.pinnacleId] = eventData.type;
            event.pinnacleEventType = type;
        }

        var dateString = eventData.startTime.toString().split(' ');
        event.slug = slug(contestants.pinnacleContestant1.contestant.name+'-vs-'+contestants.pinnacleContestant2.contestant.name+' '+dateString[1]+' '+dateString[2]+' '+dateString[3]+'--'+dateString[4].substring(0, dateString[4].length - 3));

        event.pinnacleIds = [eventData.pinnacleId];

        if('contestant1Pitcher' in eventData) event.contestant1Pitcher = eventData.contestant1Pitcher;
        if('contestant2Pitcher' in eventData) event.contestant2Pitcher = eventData.contestant2Pitcher;

        EventBl.create(event, callback);
    }

    todo.push(getPinnacleContestants);
    todo.push(checkIfContestantsAreValid);
    todo.push(matchEvent);
    todo.push(createEvent);

    function cb(err){
        if(err === 'invalid contestants') return callback(null);
        if(err === 'matched event') return callback(null);
        callback(err);
    }

    async.waterfall(todo, cb);

}

function updateEvent(eventData, event, callback){
    var fieldsToUpdate = ['startTime', 'contestant1Pitcher', 'contestant2Pitcher'];
    var fieldChange = false;

    function updateField(field, callback){
        if(!(field in eventData)) return callback();
        if(event[field] === eventData[field]) return callback();
        event[field] = event;
        callback();
    }

    function cb(err){
        if(!fieldChange) return callback(null);
        event.save(callback);
    }

    async.each(fieldsToUpdate, updateField, cb)

}

function processEvent(eventApi, pinnacleLeague, callback){
    var todo = [];


    function getValues(callback){
        parseEventApi(eventApi, pinnacleLeague, callback);
    }

    function findEvent(eventData, callback){
        function cb(err, event){
            callback(err, eventData, event);
        }
        EventBl.getOneByQuery({pinnacleIds: eventData.pinnacleId}, cb);
    }

    function updateOrCreateEvent(eventData, event, callback){
        if(event){
            updateEvent(eventData, event, callback);
        } else{
            createEvent(pinnacleLeague, eventData, callback);
        }
    }

    todo.push(getValues);
    todo.push(findEvent);
    todo.push(updateOrCreateEvent);

    async.waterfall(todo, callback);
}

function updateInsertEventsForLeague(pinnacleLeague, callback){
    var todo = [];

    function getEventsFeed(callback){
        PinApiBl.getEvents(pinnacleLeague.sportId, pinnacleLeague.leagueId, pinnacleLeague.last, callback);
    }

    function processEvents(results, callback){
        if(!results) return callback(null);
        pinnacleLeague.last = results.last;

        var eventsApi = results.league[0].events;

        function processEvent_loop(eventApi, callback){
            processEvent(eventApi, pinnacleLeague, callback);
        }

        async.eachSeries(eventsApi, processEvent_loop, callback);
    }

    function savePinnacleLeague(callback){

        pinnacleLeague.save(callback);
    }

    todo.push(getEventsFeed);
    todo.push(processEvents);
    todo.push(savePinnacleLeague);

    async.waterfall(todo, callback);
}


function updateInsertEventsForSport(pinnacleSport, callback){

    var todo = [];

    function getActiveLeagues(callback){
        PinnacleLeagueBl.getByQuery({active:true, 'pinnacleSport.ref': pinnacleSport._id}, callback);
    }

    function processLeagues(pinnacleLeagues, callback){
        function proccessLeague(pinnacleLeague, callback){
            updateInsertEventsForLeague(pinnacleLeague, callback);
        }
        async.eachSeries(pinnacleLeagues, proccessLeague, callback);
    }

    todo.push(getActiveLeagues);
    todo.push(processLeagues);

    async.waterfall(todo, callback);
}


function updateInsertAllEvents(callback){
    var todo = [];

    function getActiveSports(callback){
        PinnacleSportBl.getByQuery({active:true}, callback);
    }

    function processSports(pinnacleSports, callback){
        async.eachSeries(pinnacleSports, updateInsertEventsForSport, callback);

    }

    todo.push(getActiveSports);
    todo.push(processSports);

    async.waterfall(todo, callback);

}

exports.updateInsertAllEvents = updateInsertAllEvents;