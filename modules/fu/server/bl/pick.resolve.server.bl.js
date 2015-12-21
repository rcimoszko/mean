'use strict';

var mongoose = require('mongoose'),
    Pick = mongoose.model('Pick'),
    _ = require('lodash'),
    async = require('async');

function getScores(event, pick, contestantNo, opponentNo, callback){

    var contestantScore;
    var opponentScore;

    switch(pick.betDuration){
        case 'match':
        case 'game':
            switch(event.sport.name.toLowerCase()){
                case 'soccer':
                case 'handball':
                    contestantScore = event['contestant'+contestantNo+'RegulationScore'];
                    opponentScore = event['contestant'+opponentNo+'RegulationScore'];
                    break;
                case 'hockey':
                    if(pick.otIncluded === true){
                        contestantScore = event['contestant'+contestantNo+'FinalScore'];
                        opponentScore = event['contestant'+opponentNo+'FinalScore'];
                    } else {
                        contestantScore = event['contestant'+contestantNo+'RegulationScore'];
                        opponentScore = event['contestant'+opponentNo+'RegulationScore'];
                    }
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'FinalScore'];
                    opponentScore = event['contestant'+opponentNo+'FinalScore'];
                    break;
            }
            break;
        case '1st 5 innings':
        case '1st half':
            switch(event.sport.name.toLowerCase()){
                case 'basketball':
                case 'football':
                    if(event.league.name.toLowerCase() === 'ncaab'){
                        contestantScore = event['contestant'+contestantNo+'H1Score'];
                        opponentScore = event['contestant'+opponentNo+'H1Score'];
                    } else {
                        contestantScore = event['contestant'+contestantNo+'Q1Score'] + event['contestant'+contestantNo+'Q2Score'];
                        opponentScore = event['contestant'+opponentNo+'Q1Score'] + event['contestant'+opponentNo+'Q2Score'];
                    }
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'H1Score'];
                    opponentScore = event['contestant'+opponentNo+'H1Score'];
                    break;
            }

            break;
        case '1st set winner':
        case 'map 1':
            contestantScore = event['contestant'+contestantNo+'Set1Score'];
            opponentScore = event['contestant'+opponentNo+'Set1Score'];
            break;
        case '2nd half':
            switch(event.sport.name.toLowerCase()){
                case 'basketball':
                case 'football':
                    contestantScore = event['contestant'+contestantNo+'Q3Score'] + event['contestant'+contestantNo+'Q4Score'];
                    opponentScore = event['contestant'+opponentNo+'Q3Score'] + event['contestant'+opponentNo+'Q4Score'];
                    if(event.overtime){
                        contestantScore = contestantScore + event['contestant'+contestantNo+'OTScore'];
                        opponentScore = opponentScore + event['contestant'+opponentNo+'OTScore'];
                    }
                    break;
                case 'aussie rules':
                case 'rugby league':
                case 'rugby union':
                    contestantScore = event['contestant'+contestantNo+'H2Score'];
                    opponentScore = event['contestant'+opponentNo+'H2Score'];
                    if(event.overtime){
                        contestantScore = contestantScore + event['contestant'+contestantNo+'OTScore'];
                        opponentScore = opponentScore + event['contestant'+opponentNo+'OTScore'];
                    }
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'H2Score'];
                    opponentScore = event['contestant'+opponentNo+'H2Score'];
                    break;
            }
            break;
        case '1st period':
            contestantScore = event['contestant'+contestantNo+'P1Score'];
            opponentScore = event['contestant'+opponentNo+'P1Score'];
            break;
        case '2nd period':
            contestantScore = event['contestant'+contestantNo+'P2Score'];
            opponentScore = event['contestant'+opponentNo+'P2Score'];
            break;
        case '3rd period':
            contestantScore = event['contestant'+contestantNo+'P3Score'];
            opponentScore = event['contestant'+opponentNo+'P3Score'];
            break;
        case '1st quarter':
            contestantScore = event['contestant'+contestantNo+'Q1Score'];
            opponentScore = event['contestant'+opponentNo+'Q1Score'];
            break;
        case '2nd quarter':
            contestantScore = event['contestant'+contestantNo+'Q2Score'];
            opponentScore = event['contestant'+opponentNo+'Q2Score'];
            break;
        case '3rd quarter':
            contestantScore = event['contestant'+contestantNo+'Q3Score'];
            opponentScore = event['contestant'+opponentNo+'Q3Score'];
            break;
        case '4th quarter':
            contestantScore = event['contestant'+contestantNo+'Q4Score'];
            opponentScore = event['contestant'+opponentNo+'Q4Score'];
            break;
    }

    callback(contestantScore, opponentScore);
}

function getWinner(event, pick, contestantNo, opponentNo, contestantScore, opponentScore, callback){

    var durationWinner;

    switch(pick.betDuration){
        case 'matchups':
        case 'fight':
            if(event.draw){
                durationWinner = 'draw';
            } else {
                durationWinner = String(event.contestantWinner.ref);
            }
            break;
        default:
            switch(event.sport.name){
                case 'Darts':
                case 'Cricket':
                    if(event.draw){
                        durationWinner = 'draw';
                    } else {
                        durationWinner = String(event.contestantWinner.ref);
                    }
                    break;
                case 'Tennis':
                    if(pick.betDuration === '1st set winner'){
                        if(contestantScore > opponentScore){
                            durationWinner = String(event['contestant'+contestantNo].ref._id);
                        } else if (contestantScore < opponentScore) {
                            durationWinner = String(event['contestant'+opponentNo].ref._id);
                        }
                    } else {
                        if(event.draw){
                            durationWinner = 'draw';
                        } else {
                            durationWinner = String(event.contestantWinner.ref);
                        }
                    }
                    break;
                default:
                    if(contestantScore > opponentScore){
                        durationWinner = String(event['contestant'+contestantNo].ref._id);
                    } else if (contestantScore < opponentScore) {
                        durationWinner = String(event['contestant'+opponentNo].ref._id);
                    } else {
                        durationWinner = 'draw';
                    }
                    break;
            }
    }

    callback(durationWinner);
}

function getResult(event, pick, contestantNo, opponentNo, contestantScore, opponentScore, durationWinner, callback){

    var comparison;
    var result = null;
    var drawExists;
    var sets;
    var contestantSetsWon;
    var opponentSetsWon;
    var setSpread;


    switch(pick.betType){
        case 'moneyline':
            switch(event.sport.name.toLowerCase()){
                case 'aussie rules':
                case 'football':
                case 'rugby union':
                case 'rugby league':
                    if(pick.betDuration === 'match' || pick.betDuration === 'game') {
                        if (durationWinner === 'draw' && pick.draw) {
                            result = 'Half-Win';
                        } else if (durationWinner === String(pick.contestant.ref)) {
                            result = 'Win';
                        } else {
                            result = 'Loss';
                        }
                    } else {
                        if(event.noContest){
                            result = 'Push';
                        } else{
                            //If draw is not an option and event is draw, ML bets are push
                            drawExists = _.find(event.betsAvailable, {draw:true, betDuration: pick.betDuration});
                            if(drawExists){
                                if(durationWinner === 'draw' && pick.draw){
                                    result = 'Win';
                                } else if (durationWinner === String(pick.contestant.ref)){
                                    result = 'Win';
                                } else {
                                    result = 'Loss';
                                }
                            } else {
                                if(durationWinner === 'draw'){
                                    result = 'Push';
                                } else if(durationWinner === String(pick.contestant.ref)){
                                    result = 'Win';
                                } else {
                                    result = 'Loss';
                                }
                            }
                        }
                    }
                    break;

                default:
                    if(event.noContest){
                        result = 'Push';
                    } else{
                        //If draw is not an option and event is draw, ML bets are push
                        drawExists = _.find(event.betsAvailable, {draw:true, betDuration: pick.betDuration});
                        if(drawExists){
                            if(durationWinner === 'draw' && pick.draw){
                                result = 'Win';
                            } else if (durationWinner === String(pick.contestant.ref)){
                                result = 'Win';
                            } else {
                                result = 'Loss';
                            }
                        } else {
                            if(durationWinner === 'draw'){
                                result = 'Push';
                            } else if(durationWinner === String(pick.contestant.ref)){
                                result = 'Win';
                            } else {
                                result = 'Loss';
                            }
                        }
                    }
                    break;
            }
            break;
        case 'spread':
            switch(event.sport.name.toLowerCase()) {
                case 'volleyball':
                    contestantSetsWon = 0;
                    opponentSetsWon = 0;
                    for(sets = 1; sets<=5; sets++){
                        if(event['contestant'+contestantNo+'Set'+sets+'Score'] > event['contestant'+opponentNo+'Set'+sets+'Score']){
                            contestantSetsWon++;
                        } else if (event['contestant'+contestantNo+'Set'+sets+'Score'] < event['contestant'+opponentNo+'Set'+sets+'Score']) {
                            opponentSetsWon++;
                        }
                    }
                    setSpread = contestantSetsWon - opponentSetsWon;
                    comparison = setSpread + pick.spread;
                    if(comparison > 0){
                        result = 'Win';
                    } else if (comparison < 0){
                        result = 'Loss';
                    }
                    break;
                default:
                    var gameSpread;
                    gameSpread = contestantScore - opponentScore;
                    comparison = gameSpread + pick.spread;

                    if(comparison === 0.25){
                        result = 'Half-Win';
                    } else if (comparison === -0.25){
                        result = 'Half-Loss';
                    } else if(comparison > 0){
                        result = 'Win';
                    } else if(comparison === 0){
                        result = 'Push';
                    } else {
                        result = 'Loss';
                    }
                    break;
            }

            break;
        case 'total points':
        case 'team totals':
            switch(event.sport.name.toLowerCase()) {
                case 'mixed martial arts':
                case 'boxing':
                    var combinedRounds = (event.round-1)+ (((event.time.minutes*60) + event.time.seconds)/300);
                    comparison = combinedRounds - pick.points;
                    if(comparison === 0){
                        result = 'Push';
                    } else if(comparison > 0){
                        //over wins
                        if(pick.overUnder === 'over'){
                            result = 'Win';
                        } else if(pick.overUnder === 'under'){
                            result = 'Loss';
                        }

                    } else if (comparison < 0){
                        //under wins
                        if(pick.overUnder === 'under'){
                            result = 'Win';
                        } else if(pick.overUnder === 'over'){
                            result = 'Loss';
                        }
                    }
                    break;
                case 'volleyball':
                    if(pick.betType === 'total points'){
                        var totalSets = 0;
                        for(sets = 1; sets<=5; sets++){
                            if(event['contestant'+contestantNo+'Set'+sets+'Score'] && event['contestant'+opponentNo+'Set'+sets+'Score']) totalSets++;
                        }
                        comparison = totalSets - pick.points;

                        if (pick.overUnder === 'over') {
                            if (comparison > 0) {
                                result = 'Win';
                            } else if (comparison < 0) {
                                result = 'Loss';
                            }
                        } else if (pick.overUnder === 'under') {
                            if (comparison < 0) {
                                result = 'Win';
                            } else if (comparison > 0) {
                                result = 'Loss';
                            }
                        }
                    }
                    break;
                default:
                    if (pick.betType === 'total points') {
                        var combinedPoints;
                        combinedPoints = contestantScore + opponentScore;
                        comparison = combinedPoints - pick.points;
                    } else if (pick.betType === 'team totals') {
                        comparison = contestantScore - pick.points;
                    }

                    if (pick.overUnder === 'over') {
                        if (comparison === 0.25) {
                            result = 'Half-Win';
                        } else if (comparison === -0.25) {
                            result = 'Half-Loss';
                        } else if (comparison > 0) {
                            result = 'Win';
                        } else if (comparison === 0) {
                            result = 'Push';
                        } else {
                            result = 'Loss';
                        }
                    } else if (pick.overUnder === 'under') {
                        if (comparison === 0.25) {
                            result = 'Half-Loss';
                        } else if (comparison === -0.25) {
                            result = 'Half-Win';
                        } else if (comparison < 0) {
                            result = 'Win';
                        } else if (comparison === 0) {
                            result = 'Push';
                        } else {
                            result = 'Loss';
                        }
                    }
                    break;
            }
            break;
        case 'sets':
            contestantSetsWon = 0;
            opponentSetsWon = 0;
            for(sets = 1; sets<=5; sets++){
                if(event['contestant'+contestantNo+'Set'+sets+'Score'] > event['contestant'+opponentNo+'Set'+sets+'Score']){
                    contestantSetsWon++;
                } else if (event['contestant'+contestantNo+'Set'+sets+'Score'] < event['contestant'+opponentNo+'Set'+sets+'Score']) {
                    opponentSetsWon++;
                }
            }
            setSpread = contestantSetsWon - opponentSetsWon;
            comparison = setSpread + pick.spread;
            if(comparison > 0){
                result = 'Win';
            } else if (comparison < 0){
                result = 'Loss';
            }
            break;
    }

    callback(result);
}

function resolve(pick, result, callback){

    var todo = [];

    function updateResult_todo(callback){
        pick.result = result;
        switch(result){
            case 'Win':
                pick.profit = (pick.units*pick.odds) - pick.units;
                pick.roi = (pick.profit/pick.units)*100;
                break;
            case 'Loss':
                pick.profit = -pick.units;
                pick.roi = (pick.profit/pick.units)*100;
                break;
            case 'Push':
            case 'Cancelled':
                pick.profit = 0;
                pick.roi = 0;
                break;
            case 'Half-Win':
                pick.profit = ((pick.units*pick.odds) - pick.units)/2;
                pick.roi = (pick.profit/pick.units)*100;
                break;
            case 'Half-Loss':
                pick.profit =  -pick.units/2;
                pick.roi = (pick.profit/pick.units)*100;
                break;
        }
        callback(null);
    }

    function savePick_todo(callback){
        function cb(err){
            callback(err);
        }

        pick.timeResolved = Date.now();
        console.log(pick.slug, pick.result);
        //cb(null);
        pick.save(cb);
    }

    function done(err){
        callback(err);
    }

    todo.push(updateResult_todo);
    todo.push(savePick_todo);

    async.waterfall(todo, done);

}

function resolvePick(event, pick, callback){

    var contestantNo = 1;
    var opponentNo = 2;

    if(pick.contestant.ref && pick.contestant.ref.equals(event.contestant2.ref._id)){
        contestantNo = 2;
        opponentNo = 1;
    }
    var todo = [];

    function getScores_todo(callback){

        function cb(contestantScore, opponentScore){
            callback(null, contestantScore, opponentScore);
        }

        getScores(event, pick, contestantNo, opponentNo, cb);
    }

    function getWinner_todo(contestantScore, opponentScore, callback){

        function cb(durationWinner){
            callback(null, contestantScore, opponentScore, durationWinner);
        }

        getWinner(event, pick, contestantNo, opponentNo, contestantScore, opponentScore, cb);

    }

    function getResult_todo(contestantScore, opponentScore, durationWinner, callback){

        function cb(durationResult){
            callback(null, durationResult);
        }

        getResult(event, pick, contestantNo, opponentNo, contestantScore, opponentScore, durationWinner, cb);
    }

    function resolve_todo(result, callback){
        function cb(err){
            callback(err);
        }

        resolve(pick, result, cb);

    }

    function done(err){
        callback(err);
    }

    todo.push(getScores_todo);
    todo.push(getWinner_todo);
    todo.push(getResult_todo);
    todo.push(resolve_todo);

    async.waterfall(todo, done);

}

function resolvePicks(event, callback) {
    var todo = [];

    function getPicks_todo(callback){
        function cb(err, picks){
            callback(err, picks);
        }

        Pick.find({event:event._id}).exec(cb);
    }

    function resolvePicks_todo(picks, callback){
        if(picks.length === 0) return callback(null, true);

        function resolve(pick, callback){
            resolvePick(event, pick, callback);
        }

        function cb(err){
            callback(err, false);
        }

        async.eachSeries(picks, resolve, cb);
    }


    function done(err){
        callback(err);
    }

    todo.push(getPicks_todo);
    todo.push(resolvePicks_todo);

    async.waterfall(todo, done);
}

exports.resolvePicks = resolvePicks;
exports.resolvePick = resolvePick;