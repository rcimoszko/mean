'use strict';

var async = require('async'),
    _ = require('lodash'),
    PickBl = require('./pick.server.bl'),
    BetTypeBl = require('./bet.bettype.server.bl'),
    BetDurationBl = require('./bet.betduration.server.bl');


function getGamecenterConsensus(event, callback){
    var todo = [];
    var contestant1 = event.contestant1.ref;
    var contestant2 = event.contestant2.ref;

    function getPicks(callback){
        PickBl.getByQuery({event: event._id}, callback);
    }

    function getConsensus(picks, callback){
        var todo = [];

        function getSpreadConsensus(callback){
            var spread;
            var spreadPicks = _.filter(picks, function(pick){
                return pick.betType === 'spread' && BetDurationBl.mainBetDurations.indexOf(pick.betDuration) !== -1;
            });

            if(spreadPicks.length){
                spread = {
                    betType: 'spread',
                    header: 'SPREAD'
                };
                var contestant1Picks = _.filter(spreadPicks, function(pick){
                    return String(pick.contestant.ref) === String(contestant1._id);
                });

                var percent1 = Math.round((contestant1Picks.length/spreadPicks.length)*100,0);
                var percent2 = 100 - percent1;

                if(percent1 > percent2){
                    if(contestant1.logoUrl) spread.logoUrl = contestant1.logoUrl;
                    spread.name = contestant1.name;
                    spread.percent = percent1;
                    spread.count = contestant1Picks.length;

                } else if (percent2 > percent1){
                    if(contestant2.logoUrl) spread.logoUrl = contestant2.logoUrl;
                    spread.name = contestant2.name;
                    spread.percent = percent2;
                    spread.count = spreadPicks.length - contestant1Picks.length;
                } else {
                    if(contestant1.logoUrl) spread.logoUrl = contestant1.logoUrl;
                    spread.name = contestant1.name;
                    spread.percent = 50;
                    spread.count = contestant1Picks.length;
                }
            }
            callback(null, spread);
        }

        function getMoneylineConsensus(callback){
            var moneyline;

            var moneylinePicks = _.filter(picks, function(pick){
                return pick.betType === 'moneyline' && BetDurationBl.mainBetDurations.indexOf(pick.betDuration) !== -1;
            });
            if(moneylinePicks.length){
                moneyline = {
                    betType: 'moneyline',
                    header: 'MONEYLINE'
                };

                var contestant1Picks = _.filter(moneylinePicks, function(pick){
                    return String(pick.contestant.ref) === String(contestant1._id);
                });

                var percent1 = Math.round((contestant1Picks.length/moneylinePicks.length)*100,0);
                var percent2 = 100 - percent1;

                if(percent1 > percent2){
                    if(contestant1.logoUrl) moneyline.logoUrl = contestant1.logoUrl;
                    moneyline.name = contestant1.name;
                    moneyline.percent = percent1;
                    moneyline.count = contestant1Picks.length;

                } else if (percent2 > percent1){
                    if(contestant2.logoUrl) moneyline.logoUrl = contestant2.logoUrl;
                    moneyline.name = contestant2.name;
                    moneyline.percent = percent2;
                    moneyline.count = moneylinePicks.length - contestant1Picks.length;
                } else {
                    if(contestant1.logoUrl) moneyline.logoUrl = contestant1.logoUrl;
                    moneyline.name = contestant1.name;
                    moneyline.percent = 50;
                    moneyline.count = contestant1Picks.length;
                }
            }
            callback(null, moneyline);
        }

        function getTotalsConsensus(callback){
            var totals;
            var totalsPicks = _.filter(picks, function(pick){
                return pick.betType === 'total points' && BetDurationBl.mainBetDurations.indexOf(pick.betDuration) !== -1;
            });
            if(totalsPicks.length){
                totals = {
                    betType: 'total points',
                    header: 'TOTALS'
                };
                var overPicks = _.filter(totalsPicks, function(pick){
                    return pick.overUnder === 'over';
                });

                var percent1 = Math.round((overPicks.length/totalsPicks.length)*100,0);
                var percent2 = 100 - percent1;

                if(percent1 > percent2){
                    totals.overUnder = 'over';
                    totals.name = 'Over';
                    totals.percent = percent1;
                    totals.count = overPicks.length;
                } else if (percent2 > percent1){
                    totals.overUnder = 'over';
                    totals.name = 'Under';
                    totals.percent = percent2;
                    totals.count = totalsPicks.length - overPicks.length;
                } else {
                    totals.overUnder = 'over';
                    totals.name = 'Over';
                    totals.percent = 50;
                    totals.count = overPicks.length;
                }
            }
            callback(null, totals);
        }

        todo.push(getSpreadConsensus);
        todo.push(getMoneylineConsensus);
        todo.push(getTotalsConsensus);

        function cb(err, results){
            results = _.pull(results, undefined);
            callback(err, results);
        }

        async.parallel(todo, cb);

    }

    todo.push(getPicks);
    todo.push(getConsensus);

    async.waterfall(todo, callback);

}

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
exports.getGamecenterConsensus = getGamecenterConsensus;