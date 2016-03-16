'use strict';

var mongoose = require('mongoose'),
    Pick = mongoose.model('Pick'),
    UserBl = require('./user.server.bl'),
    _ = require('lodash'),
    async = require('async');

function getScores(event, pick, contestantNo, opponentNo, callback){

    var contestantScore;
    var opponentScore;

    switch(pick.betDuration){
        case 'ace':
            contestantScore = event['contestant'+contestantNo+'AceWinner'];
            opponentScore = event['contestant'+opponentNo+'AceWinner'];
            break;
        case 'kills':
            contestantScore = event['contestant'+contestantNo+'FinalScore'];
            opponentScore = event['contestant'+opponentNo+'FinalScore'];
            break;
        case 'cache':
            switch(pick.betType.toLowerCase()){
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'CacheFirstRd'];
                    opponentScore = event['contestant'+opponentNo+'CacheFirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'CacheFirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'CacheFirstTo5Rds'];
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'CacheScore'];
                    opponentScore = event['contestant'+opponentNo+'CacheScore'];
                    break;
            }
            break;
        case 'dust 2':
        case 'dust2':
            switch(pick.betType.toLowerCase()){
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'Dust2FirstRd'];
                    opponentScore = event['contestant'+opponentNo+'Dust2FirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'Dust2FirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'Dust2FirstTo5Rds'];
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'Dust2Score'];
                    opponentScore = event['contestant'+opponentNo+'Dust2Score'];
                    break;
            }
            break;
        case 'overpass':
            switch(pick.betType.toLowerCase()){
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'OverpassFirstRd'];
                    opponentScore = event['contestant'+opponentNo+'OverpassFirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'OverpassFirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'OverpassFirstTo5Rds'];
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'OverpassScore'];
                    opponentScore = event['contestant'+opponentNo+'OverpassScore'];
                    break;
            }
            break;
        case 'inferno':
            switch(pick.betType.toLowerCase()){
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'InfernoFirstRd'];
                    opponentScore = event['contestant'+opponentNo+'InfernoFirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'InfernoFirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'InfernoFirstTo5Rds'];
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'InfernoScore'];
                    opponentScore = event['contestant'+opponentNo+'InfernoScore'];
                    break;
            }
            break;
        case 'cobble':
        case 'cobble.':
            switch(pick.betType.toLowerCase()){
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'CobbleFirstRd'];
                    opponentScore = event['contestant'+opponentNo+'CobbleFirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'CobbleFirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'CobbleFirstTo5Rds'];
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'CobbleScore'];
                    opponentScore = event['contestant'+opponentNo+'CobbleScore'];
                    break;
            }
            break;
        case 'train':
            switch(pick.betType.toLowerCase()){
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'TrainFirstRd'];
                    opponentScore = event['contestant'+opponentNo+'TrainFirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'TrainFirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'TrainFirstTo5Rds'];
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'TrainScore'];
                    opponentScore = event['contestant'+opponentNo+'TrainScore'];
                    break;
            }
            break;
        case 'mirage':
            switch(pick.betType.toLowerCase()){
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'MirageFirstRd'];
                    opponentScore = event['contestant'+opponentNo+'MirageFirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'MirageFirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'MirageFirstTo5Rds'];
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'MirageScore'];
                    opponentScore = event['contestant'+opponentNo+'MirageScore'];
                    break;
            }
            break;
        case 'series':
            contestantScore = event['contestant'+contestantNo+'MapsWon'];
            opponentScore = event['contestant'+opponentNo+'MapsWon'];
            break;
        case 'match':
        case 'game':
        case 'matchups':
        case 'fight':
            switch(event.sport.name.toLowerCase()){
                case 'e sports':
                    switch(pick.betType.toLowerCase()){
                        case '1st blood':
                            contestantScore = event['contestant'+contestantNo+'FirstBlood'];
                            opponentScore = event['contestant'+opponentNo+'FirstBlood'];
                            break;
                        case '1st to 5 kills':
                            contestantScore = event['contestant'+contestantNo+'Kills5First'];
                            opponentScore = event['contestant'+opponentNo+'Kills5First'];
                            break;
                        case '1st to 10 kills':
                            contestantScore = event['contestant'+contestantNo+'Kills10First'];
                            opponentScore = event['contestant'+opponentNo+'Kills10First'];
                            break;
                        case 'moneyline':
                            if(typeof event['contestant'+contestantNo+'MatchWinner'] !== 'undefined' && typeof event['contestant'+opponentNo+'MatchWinner'] !== 'undefined'){
                                contestantScore = event['contestant'+contestantNo+'MatchWinner'];
                                opponentScore = event['contestant'+opponentNo+'MatchWinner'];
                            } else {
                                contestantScore = event['contestant'+contestantNo+'FinalScore'];
                                opponentScore = event['contestant'+opponentNo+'FinalScore'];
                            }
                            break;
                        default:
                            contestantScore = event['contestant'+contestantNo+'FinalScore'];
                            opponentScore = event['contestant'+opponentNo+'FinalScore'];
                            break;
                    }
                    break;
                case 'soccer':
                case 'handball':
                case 'hockey':
                    contestantScore = event['contestant'+contestantNo+'RegulationScore'];
                    opponentScore = event['contestant'+opponentNo+'RegulationScore'];
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'FinalScore'];
                    opponentScore = event['contestant'+opponentNo+'FinalScore'];
                    break;
            }
            break;
        case 'game (OT included)':
            contestantScore = event['contestant'+contestantNo+'FinalScore'];
            opponentScore = event['contestant'+opponentNo+'FinalScore'];
            break;
        case 'game (regular time)':
            contestantScore = event['contestant'+contestantNo+'RegulationScore'];
            opponentScore = event['contestant'+opponentNo+'RegulationScore'];
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
            contestantScore = event['contestant'+contestantNo+'Set1Score'];
            opponentScore = event['contestant'+opponentNo+'Set1Score'];
            break;
        case 'map 1':
        case '1st map':
            switch(pick.betType.toLowerCase()){
                case '1st blood':
                    contestantScore = event['contestant'+contestantNo+'Map1FirstBlood'];
                    opponentScore = event['contestant'+opponentNo+'Map1FirstBlood'];
                    break;
                case '1st to 5 kills':
                    contestantScore = event['contestant'+contestantNo+'Map1Kills5First'];
                    opponentScore = event['contestant'+opponentNo+'Map1Kills5First'];
                    break;
                case '1st to 10 kills':
                    contestantScore = event['contestant'+contestantNo+'Map1Kills10First'];
                    opponentScore = event['contestant'+opponentNo+'Map1Kills10First'];
                    break;
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'Map1FirstRd'];
                    opponentScore = event['contestant'+opponentNo+'Map1FirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'Map1FirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'Map1FirstTo5Rds'];
                    break;
                case 'moneyline':
                    if(typeof event['contestant'+contestantNo+'Map1Winner'] !== 'undefined' && typeof event['contestant'+opponentNo+'Map1Winner'] !== 'undefined'){
                        contestantScore = event['contestant'+contestantNo+'Map1Winner'];
                        opponentScore = event['contestant'+opponentNo+'Map1Winner'];
                    } else {
                        contestantScore = event['contestant'+contestantNo+'Map1Score'];
                        opponentScore = event['contestant'+opponentNo+'Map1Score'];
                    }
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'Map1Score'];
                    opponentScore = event['contestant'+opponentNo+'Map1Score'];
                    break;
            }
            break;
        case 'map 2':
        case '2nd map':
            switch(pick.betType.toLowerCase()){
                case '1st blood':
                    contestantScore = event['contestant'+contestantNo+'Map2FirstBlood'];
                    opponentScore = event['contestant'+opponentNo+'Map2FirstBlood'];
                    break;
                case '1st to 5 kills':
                    contestantScore = event['contestant'+contestantNo+'Map2Kills5First'];
                    opponentScore = event['contestant'+opponentNo+'Map2Kills5First'];
                    break;
                case '1st to 10 kills':
                    contestantScore = event['contestant'+contestantNo+'Map2Kills10First'];
                    opponentScore = event['contestant'+opponentNo+'Map2Kills10First'];
                    break;
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'Map2FirstRd'];
                    opponentScore = event['contestant'+opponentNo+'Map2FirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'Map2FirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'Map2FirstTo5Rds'];
                    break;
                case 'moneyline':
                    if(typeof event['contestant'+contestantNo+'Map2Winner'] !== 'undefined' && typeof event['contestant'+opponentNo+'Map2Winner'] !== 'undefined'){
                        contestantScore = event['contestant'+contestantNo+'Map2Winner'];
                        opponentScore = event['contestant'+opponentNo+'Map2Winner'];
                    } else {
                        contestantScore = event['contestant'+contestantNo+'Map2Score'];
                        opponentScore = event['contestant'+opponentNo+'Map2Score'];
                    }
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'Map2Score'];
                    opponentScore = event['contestant'+opponentNo+'Map2Score'];
                    break;
            }
            break;
        case 'map 3':
        case '3rd map':
            switch(pick.betType.toLowerCase()){
                case '1st blood':
                    contestantScore = event['contestant'+contestantNo+'Map3FirstBlood'];
                    opponentScore = event['contestant'+opponentNo+'Map3FirstBlood'];
                    break;
                case '1st to 5 kills':
                    contestantScore = event['contestant'+contestantNo+'Map3Kills5First'];
                    opponentScore = event['contestant'+opponentNo+'Map3Kills5First'];
                    break;
                case '1st to 10 kills':
                    contestantScore = event['contestant'+contestantNo+'Map3Kills10First'];
                    opponentScore = event['contestant'+opponentNo+'Map3Kills10First'];
                    break;
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'Map3FirstRd'];
                    opponentScore = event['contestant'+opponentNo+'Map3FirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'Map3FirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'Map3FirstTo5Rds'];
                    break;
                case 'moneyline':
                    if(typeof event['contestant'+contestantNo+'Map3Winner'] !== 'undefined' && typeof event['contestant'+opponentNo+'Map3Winner'] !== 'undefined'){
                        contestantScore = event['contestant'+contestantNo+'Map3Winner'];
                        opponentScore = event['contestant'+opponentNo+'Map3Winner'];
                    } else {
                        contestantScore = event['contestant'+contestantNo+'Map3Score'];
                        opponentScore = event['contestant'+opponentNo+'Map3Score'];
                    }
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'Map3Score'];
                    opponentScore = event['contestant'+opponentNo+'Map3Score'];
                    break;
            }
            break;
        case 'map 4':
        case '4th map':
            switch(pick.betType.toLowerCase()){
                case '1st blood':
                    contestantScore = event['contestant'+contestantNo+'Map4FirstBlood'];
                    opponentScore = event['contestant'+opponentNo+'Map4FirstBlood'];
                    break;
                case '1st to 5 kills':
                    contestantScore = event['contestant'+contestantNo+'Map4Kills5First'];
                    opponentScore = event['contestant'+opponentNo+'Map4Kills5First'];
                    break;
                case '1st to 10 kills':
                    contestantScore = event['contestant'+contestantNo+'Map4Kills10First'];
                    opponentScore = event['contestant'+opponentNo+'Map4Kills10First'];
                    break;
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'Map4FirstRd'];
                    opponentScore = event['contestant'+opponentNo+'Map4FirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'Map4FirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'Map4FirstTo5Rds'];
                    break;
                case 'moneyline':
                    if(typeof event['contestant'+contestantNo+'Map4Winner'] !== 'undefined' && typeof event['contestant'+opponentNo+'Map4Winner'] !== 'undefined'){
                        contestantScore = event['contestant'+contestantNo+'Map4Winner'];
                        opponentScore = event['contestant'+opponentNo+'Map4Winner'];
                    } else {
                        contestantScore = event['contestant'+contestantNo+'Map4Score'];
                        opponentScore = event['contestant'+opponentNo+'Map4Score'];
                    }
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'Map4Score'];
                    opponentScore = event['contestant'+opponentNo+'Map4Score'];
                    break;
            }
            break;
        case 'map 5':
        case '5th map':
            switch(pick.betType.toLowerCase()){
                case '1st blood':
                    contestantScore = event['contestant'+contestantNo+'Map5FirstBlood'];
                    opponentScore = event['contestant'+opponentNo+'Map5FirstBlood'];
                    break;
                case '1st to 5 kills':
                    contestantScore = event['contestant'+contestantNo+'Map5Kills5First'];
                    opponentScore = event['contestant'+opponentNo+'Map5Kills5First'];
                    break;
                case '1st to 10 kills':
                    contestantScore = event['contestant'+contestantNo+'Map5Kills10First'];
                    opponentScore = event['contestant'+opponentNo+'Map5Kills10First'];
                    break;
                case '1st round':
                    contestantScore = event['contestant'+contestantNo+'Map5FirstRd'];
                    opponentScore = event['contestant'+opponentNo+'Map5FirstRd'];
                    break;
                case '1st to 5 rounds':
                    contestantScore = event['contestant'+contestantNo+'Map5FirstTo5Rds'];
                    opponentScore = event['contestant'+opponentNo+'Map5FirstTo5Rds'];
                    break;
                case 'moneyline':
                    if(typeof event['contestant'+contestantNo+'Map5Winner'] !== 'undefined' && typeof event['contestant'+opponentNo+'Map5Winner'] !== 'undefined'){
                        contestantScore = event['contestant'+contestantNo+'Map5Winner'];
                        opponentScore = event['contestant'+opponentNo+'Map5Winner'];
                    } else {
                        contestantScore = event['contestant'+contestantNo+'Map5Score'];
                        opponentScore = event['contestant'+opponentNo+'Map5Score'];
                    }
                    break;
                default:
                    contestantScore = event['contestant'+contestantNo+'Map5Score'];
                    opponentScore = event['contestant'+opponentNo+'Map5Score'];
                    break;
            }
            break;
        case 'map 6': //starcraft
            contestantScore = event['contestant'+contestantNo+'Map6Winner'];
            opponentScore = event['contestant'+opponentNo+'Map6Winner'];
            break;
        case 'map 7': //starcraft
            contestantScore = event['contestant'+contestantNo+'Map7Winner'];
            opponentScore = event['contestant'+opponentNo+'Map7Winner'];
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
        case 'fight':
            if(event.draw){
                durationWinner = 'draw';
            } else if (event.contestantWinner.ref) {
                durationWinner = String(event.contestantWinner.ref);
            } else if(contestantScore > opponentScore){
                durationWinner = String(event['contestant'+contestantNo].ref);
            } else if (contestantScore < opponentScore) {
                durationWinner = String(event['contestant'+opponentNo].ref);
            }
            break;
        case 'matchups':
        case 'race':
        case 'election':
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
                            durationWinner = String(event['contestant'+contestantNo].ref);
                        } else if (contestantScore < opponentScore) {
                            durationWinner = String(event['contestant'+opponentNo].ref);
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
                        durationWinner = String(event['contestant'+contestantNo].ref);
                    } else if (contestantScore < opponentScore) {
                        durationWinner = String(event['contestant'+opponentNo].ref);
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
    var setCount;
    var gameSpread;


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
                            drawExists = _.find(event.pinnacleBets, {draw:true, betDuration: pick.betDuration});
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
                        drawExists = _.find(event.pinnacleBets, {draw:true, betDuration: pick.betDuration});
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
                    if(contestantSetsWon !== 0 && opponentSetsWon !== 0){
                        //for set spread
                        setSpread = contestantSetsWon - opponentSetsWon;
                        comparison = setSpread + pick.spread;
                    } else {
                        //for final score spread
                        gameSpread = contestantScore - opponentScore;
                        comparison = gameSpread + pick.spread;
                    }
                    if(comparison > 0){
                        result = 'Win';
                    } else if (comparison < 0){
                        result = 'Loss';
                    }
                    break;
                default:
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
                        if(typeof event['contestant'+contestantNo+'Set1Score'] !== 'undefined'){
                            for(sets = 1; sets<=5; sets++){
                                if(event['contestant'+contestantNo+'Set'+sets+'Score'] && event['contestant'+opponentNo+'Set'+sets+'Score']) totalSets++;
                            }
                        } else {
                            totalSets = event['contestant'+contestantNo+'FinalScore'] + event['contestant'+opponentNo+'FinalScore'];
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

        case 'series':
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

        case 'sets':
            contestantSetsWon = 0;
            opponentSetsWon = 0;
            setCount = 0;
            for(sets = 1; sets<=5; sets++){
                if(event['contestant'+contestantNo+'Set'+sets+'Score'] > event['contestant'+opponentNo+'Set'+sets+'Score']){
                    contestantSetsWon++;
                    setCount++;
                } else if (event['contestant'+contestantNo+'Set'+sets+'Score'] < event['contestant'+opponentNo+'Set'+sets+'Score']) {
                    opponentSetsWon++;
                    setCount++;
                }
            }
            if(setCount > 1) {
                setSpread = contestantSetsWon - opponentSetsWon;
                comparison = setSpread + pick.spread;
                if (comparison > 0) {
                    result = 'Win';
                } else if (comparison < 0) {
                    result = 'Loss';
                }
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

    function updateStreak(callback){
        UserBl.updateStreak(pick.user.ref, callback);
    }

    function savePick_todo(callback){
        function cb(err){
            if(err) console.log(err);
            callback(null);
        }

        pick.timeResolved = Date.now();
        console.log(pick.slug, pick.result);
        pick.save(cb);
    }

    function done(err){
        callback(err, pick);
    }

    todo.push(updateResult_todo);
    todo.push(updateStreak);
    todo.push(savePick_todo);

    async.waterfall(todo, done);

}

function resolvePick(event, pick, callback){
    var contestantNo = 1;
    var opponentNo = 2;

    if(pick.contestant.ref && pick.contestant.ref.equals(event.contestant2.ref)){
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
        if(typeof contestantScore === 'undefined' || typeof opponentScore === 'undefined') return callback('Scores Undefined');
        function cb(durationWinner){
            callback(null, contestantScore, opponentScore, durationWinner);
        }

        getWinner(event, pick, contestantNo, opponentNo, contestantScore, opponentScore, cb);

    }

    function getResult_todo(contestantScore, opponentScore, durationWinner, callback){
        if(typeof durationWinner === 'undefined') return callback('Winner Undefined');
        function cb(durationResult){
            callback(null, durationResult);
        }

        getResult(event, pick, contestantNo, opponentNo, contestantScore, opponentScore, durationWinner, cb);
    }

    function resolve_todo(result, callback){
        if(typeof result === 'undefined') return callback(null);
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
        if(picks.length === 0) return callback(null);

        function resolve(pick, callback){
            function cb(err){
                if(err) console.log(err);
                callback();
            }

            resolvePick(event, pick, cb);
        }

        async.eachSeries(picks, resolve, callback);
    }

    function checkUnresolvedPicks(callback){
        function cb(err, count){
            if(count === 0) event.resolved = true;
            callback(err);
        }
        Pick.count({event: event._id, result:'Pending'}).exec(cb);
    }

    function updateEvent(callback){
        event.over = true;
        event.endTime = new Date();
        event.save(callback);
    }


    function done(err){
        callback(err, event);
    }

    todo.push(getPicks_todo);
    todo.push(resolvePicks_todo);
    todo.push(checkUnresolvedPicks);
    todo.push(updateEvent);

    async.waterfall(todo, done);
}

exports.resolvePicks = resolvePicks;
exports.resolvePick = resolvePick;
exports.resolve = resolve;