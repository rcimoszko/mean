var async = require('async'),
    PinEventsBl = require('../bl/pinnacle.api.events.server.bl'),
    PinLeaguesBl = require('../bl/pinnacle.api.leagues.server.bl'),
    PinSportsBl = require('../bl/pinnacle.api.sports.server.bl'),
    PinOddsBl = require('../bl/pinnacle.api.odds.server.bl'),
    PinScoresBl = require('../bl/pinnacle.api.scores.server.bl');


function runFeed(callback){
    var todo = [];

    function updateSports(callback){
        PinSportsBl.updateInsertSports(callback);
    }

    function updateLeagues(callback){
        PinLeaguesBl.updateInsertAllLeagues(callback);
    }

    function updateEvents(callback){
        PinEventsBl.updateInsertAllEvents(callback);

    }

    function updateOdds(callback){
        PinOddsBl.updateInsertAllOdds(callback);
    }


    function updateScores(callback){
        PinScoresBl.updateInsertAllScores(callback);
    }

    todo.push(updateSports);
    todo.push(updateLeagues);
    todo.push(updateEvents);
    todo.push(updateOdds);
    //todo.push(updateScores);

    async.waterfall(todo, callback)

}

exports.runFeed = runFeed;