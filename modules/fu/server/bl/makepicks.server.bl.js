'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    slug = require('speakingurl'),
    League = mongoose.model('League'),
    m_Event = mongoose.model('Event'),
    TimezoneBl = require('./timezone.server.bl'),
    EventBl = require('./event.server.bl');

function filterAltLine(bet){
    return bet.altLine;
}

function filterMainLine(bet){
    return bet.altLine === undefined;
}

function groupContestantName(bet){
    return bet.contestant.name;
}
function filterMoneylines(bet){
    return bet.draw === undefined;
}
function setActive(bets){
    for(var i=0; i<bets.length; i++){
        if(!bets[i].altLine) bets[i].active = true;
    }
}

function processSpread(betBt){
    setActive(betBt);
    return _.groupBy(betBt, groupContestantName);
}

function processSets(betBt){
    betBt[0].active = true;
    betBt[1].active = true;
    if(betBt.length === 4){
        betBt[2].altLine = true;
        betBt[3].altLine = true;
    }

    return _.groupBy(betBt, groupContestantName);
}

function processMoneylines(betBt){
    var moneylines = _.filter(betBt, filterMoneylines);
    moneylines = _.groupBy(moneylines, groupContestantName);
    var draw = _.filter(betBt, {draw:true});
    if(draw.length){
        moneylines.draw = [draw[0]];
    }
    return moneylines;
}

function processTotalPoints(betBt){
    setActive(betBt);
    return _.groupBy(betBt, 'overUnder');
}

function processTeamTotals(betBt){
    setActive(betBt);
    var bets = _.groupBy(betBt, groupContestantName);
    for(var c in bets){
        bets[c] = _.groupBy(bets[c], 'overUnder');
    }
    return bets;
}

function processBetTypes(betBt, betType){
    var bets;
    switch(betType){
        case 'spread':
            bets = processSpread(betBt);
            break;
        case 'moneyline':
            bets = processMoneylines(betBt);
            break;
        case 'total points':
        case 'total kills':
            bets = processTotalPoints(betBt);
            break;
        case 'team totals':
        case 'team kills':
            bets = processTeamTotals(betBt);
            break;
        case 'sets':
            bets = processSets(betBt);
            break;
        default:
            bets = processMoneylines(betBt);
            break;
    }
    return bets;
}

function getPicks(query, callback){
    var todo = [];
    var processedEvents = [];
    var leagueId = query.leagueId;
    var results = {};

    function getEvents(callback){
        var now = new Date();
        var query = {'league.ref': leagueId};

        query.startTime = { $gte: now };
        query.pinnacleBets = { $not: {$size: 0} };

        var select = 'sport league neutral contestant1 contestant2 startTime pinnacleBets contestant1Pitcher contestant2Pitcher gameNo commentCount slug';
        var sort = 'startTime';
        var populate = [
            {path:'sport.ref', select: 'name slug'},
            {path:'pinnacleBets', select: 'betType betDuration otIncluded odds altLine altNumber spread contestant points overUnder draw underdog openingOdds openingSpread openingPoints'},
            {path:'contestant1.ref', select: 'name darkColor lightColor name1 name2 record'},
            {path:'contestant2.ref', select: 'name darkColor lightColor name1 name2 record'}];

        m_Event.find(query).select(select).sort(sort).populate(populate).exec(callback);
    }

    function getBetTypes(events, callback){
        var betTypeOrder = ['spread', 'moneyline', 'total points', 'team totals', 'sets'];
        results.betTypes = _.chain(events).pluck('pinnacleBets').flatten().pluck('betType').unique().value();
        results.betTypes = _.sortBy(results.betTypes, function(betType){
            if(betTypeOrder.indexOf(betType) === -1) return betTypeOrder.length;
            return betTypeOrder.indexOf(betType);
        });
        callback(null, events);
    }


    function getBetDurations(events, callback){
        var betDurationOrder = ['match', 'matchups', 'game', 'game (OT included)', 'game (regular time)', 'fight', 'series', '1st set winner', '1st 5 innings', '1st half', '2nd half', '1st period', '2nd period', '3rd period', '1st quarter', '2nd quarter', '3rd quarter', '4th quarter', 'map 1', 'map 2', 'map 3'];
        results.betDurations = _.chain(events).pluck('pinnacleBets').flatten().pluck('betDuration').unique().value();
        results.betDurations = _.sortBy(results.betDurations, function(betDuration){
            if(betDurationOrder.indexOf(betDuration) === -1) return betDurationOrder.length;
            return betDurationOrder.indexOf(betDuration);
        });
        callback(null, events);

    }

    function processEventBets(events, callback){

        function processBets(m_event, callback){
            var todo = [];
            var event = m_event.toJSON();
            var bets = [];


            function groupBets(callback){

                bets = _.groupBy(event.pinnacleBets, 'betDuration');

                for(var bd in bets){
                    bets[bd] = _.groupBy(bets[bd], 'betType');
                    for(var bt in bets[bd]){
                        bets[bd][bt] = processBetTypes(bets[bd][bt], bt);
                    }
                }
                event.bets = bets;


                callback();
            }

            function divideBets(callback){
                var mainGroups = ['match', 'game', 'fight', 'matchups', 'series'];


                event.bets = {more:{}};

                var moreBetsCount = _.filter(event.pinnacleBets, function(bet){
                    return mainGroups.indexOf(bet.betDuration) === -1;
                });
                if (moreBetsCount.length) event.bets.moreCount = moreBetsCount.length;

                for(var betDuration in bets){
                    if(mainGroups.indexOf(betDuration) !== -1){
                        event.bets.main = bets[betDuration];
                    } else {
                        event.bets.more[betDuration] = bets[betDuration];
                    }
                }
                callback();
            }

            function removeBets(callback){
                delete event.pinnacleBets;
                processedEvents.push(event);
                callback();
            }

            todo.push(groupBets);
            //todo.push(divideBets);
            todo.push(removeBets);

            async.waterfall(todo, callback);

        }

        async.each(events, processBets, callback);

    }

    function groupEventsByDay(callback){
        var eventsByDate = _.groupBy(processedEvents, function(event){
            var date = new Date(event.startTime);
            date.setHours(date.getHours()+TimezoneBl.timezoneAdjust);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        });

        var events = [];
        for(var date in eventsByDate){
            events.push({date:new Date(date), events:eventsByDate[date]});
        }

        results.events = _.sortBy(events, 'date');

        callback(null, results);
    }

    todo.push(getEvents);
    todo.push(getBetTypes);
    todo.push(getBetDurations);
    todo.push(processEventBets);
    todo.push(groupEventsByDay);

    async.waterfall(todo, callback);

}

function processMenu(sports){
    var menu = [];

    for(var i=0; i < sports.length; i++){
        var sportMenu = sports[i];
        var menuItem = {};
        var more = [];
        var groups = {};

        menuItem.name = sportMenu._id.name;
        menuItem.slug = sportMenu._id.slug;
        menuItem._id = sportMenu._id._id;
        menuItem.iconUrl = sportMenu._id.iconUrl;

        switch(sportMenu._id.name){
            case 'E Sports':
                menuItem.main = [];
                groups = _.groupBy(sportMenu.leagues, function(league){
                    if(league.group){
                        return league.group.name;
                    }
                });
                for (var groupName in groups){
                    if(groupName !== 'undefined'){
                        menuItem.main.push({name:groupName, main: groups[groupName], abstract:true, slug: slug(groupName)});
                    }
                }
                if('undefined' in groups){
                    menuItem.main.push({name:'More', main: groups['undefined'], abstract:true, slug: 'more'});
                }
                break;
            default:
                menuItem.main = _.filter(sportMenu.leagues, {main: true});
                if(menuItem.main.length === 0){
                    menuItem.main = sportMenu.leagues;
                } else {
                    more = _.filter(sportMenu.leagues, {main: false});
                    if(more.length){
                        menuItem.main.push({name: 'More', main: more, abstract: true, slug:'more' });
                    }
                }
                break;

        }

        menu.push(menuItem);
    }
    menu = _.sortBy(menu, 'name');

    return menu;
}

function getMenu(callback){
    var todo = [];

    function groupLeagues(callback){

        var match = {$match: {active: true}};
        var group = {$group: {_id: '$sport.ref', leagues: {$addToSet: '$$ROOT'}}};
        var sort =  {$sort: {_id: 1}};


        League.aggregate([match, group, sort], callback);
    }

    function populateSports(sports, callback){
        League.populate(sports, {path: '_id', select: 'name _id slug iconUrl', model:'Sport'}, callback);
    }
    function populateGroups(sports, callback){
        League.populate(sports, {path: 'leagues.group.ref', select: 'name _id slug', model:'Group'}, callback);

    }

    function cb(err, sports){
        callback(err, processMenu(sports));
    }

    todo.push(groupLeagues);
    todo.push(populateSports);
    todo.push(populateGroups);

    async.waterfall(todo, cb);

}

exports.getPicks    = getPicks;
exports.getMenu     = getMenu;