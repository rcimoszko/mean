'use strict';

var async = require('async'),
    _ = require('lodash'),
    BetTypeBl = require('./bet.bettype.server.bl'),
    BetDurationBl = require('./bet.betduration.server.bl');


function getEventConsensus(picks, contestant1, contestant2, callback){
    var todo = [];
    var consensus = {
        pickCount: picks.length
    };

    var contestant1Color = 'blue';
    var contestant2Color = 'green';
    var overColor = '#21759b';
    var underColor = '#21759b';
    if(contestant1.lightColor) contestant1Color = contestant1.lightColor;
    if(contestant2.lightColor) contestant2Color = contestant2.lightColor;
    if(contestant1.logoUrl)   consensus.contestant1logoUrl = contestant1.logoUrl;
    if(contestant1.logoUrl)   consensus.contestant2logoUrl = contestant2.logoUrl;

    function getSpreadConsensus(callback){
        var spread = {
            betType: 'spread',
            header: 'SPREAD',
            color1: contestant1Color,
            color2: contestant2Color
        };
        var spreadPicks = _.filter(picks, function(pick){
            return pick.betType === 'spread' && BetDurationBl.mainBetDurations.indexOf(pick.betDuration) !== -1;
        });
        if(spreadPicks.length){
            var contestant1Picks = _.filter(spreadPicks, function(pick){
                return String(pick.contestant.ref) === String(contestant1._id);
            });

            spread.pick1Count  = contestant1Picks.length;
            spread.pick2Count  = spreadPicks.length - contestant1Picks.length;
            spread.percent1 = Math.round((contestant1Picks.length/spreadPicks.length)*100,0);
            spread.percent2 = 100 - spread.percent1;

        }
        callback(null, spread);
    }

    function getMoneylineConsensus(callback){
        var moneyline = {
            betType: 'moneyline',
            header: 'ML',
            color1: contestant1Color,
            color2: contestant2Color
        };
        var moneylinePicks = _.filter(picks, function(pick){
            return pick.betType === 'moneyline' && BetDurationBl.mainBetDurations.indexOf(pick.betDuration) !== -1;
        });
        if(moneylinePicks.length){
            moneyline.pickCount  = moneylinePicks.length;
            var contestant1Picks = _.filter(moneylinePicks, function(pick){
                return String(pick.contestant.ref) === String(contestant1._id);
            });
            moneyline.pick1Count  = contestant1Picks.length;
            moneyline.pick2Count  = moneylinePicks.length - contestant1Picks.length;
            moneyline.percent1 = Math.round((contestant1Picks.length/moneylinePicks.length)*100,0);
            moneyline.percent2 = 100 - moneyline.percent1;
        }
        callback(null, moneyline);
    }

    function getTotalsConsensus(callback){
        var totals = {
            betType: 'total points',
            header: 'O/U',
            color1: overColor,
            color2: underColor
        };
        var totalsPicks = _.filter(picks, function(pick){
            return pick.betType === 'total points' && BetDurationBl.mainBetDurations.indexOf(pick.betDuration) !== -1;
        });
        if(totalsPicks.length){
            totals.pickCount  = totalsPicks.length;
            var overPicks = _.filter(totalsPicks, function(pick){
                return pick.overUnder === 'over';
            });

            totals.pick1Count  = overPicks.length;
            totals.pick2Count  = totalsPicks.length - overPicks.length;
            totals.percent1 = Math.round((overPicks.length/totalsPicks.length)*100,0);
            totals.percent2 = 100 - totals.percent1;
        }
        callback(null, totals);
    }
    todo.push(getSpreadConsensus);
    todo.push(getMoneylineConsensus);
    todo.push(getTotalsConsensus);

    function cb(err, results){
        results = _.sortBy(results, function(betGroup){
            return BetTypeBl.mainBetTypes.indexOf(betGroup.betType);
        });
        consensus.consensus = results;
        callback(err, consensus);
    }

    async.parallel(todo, cb);

    /*
    [
        {betType: spread, contestant1Color, team1Percent, team1Logo, }
    ]
    */
}

exports.getEventConsensus = getEventConsensus;