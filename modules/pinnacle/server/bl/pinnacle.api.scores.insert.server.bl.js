'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    LeagueBl = require('../../../fu/server/bl/league.server.bl'),
    async = require('async');


function insertScores_badminton(event, scores, callback){
    if('1st game' in scores){
        event.contestant1Set1Score = scores['1st game'].team1;
        event.contestant2Set2Score = scores['1st game'].team2;
    }
     if('2nd game' in scores){
        event.contestant1Set2Score = scores['2nd game'].team1;
        event.contestant2Set2Score = scores['2nd game'].team2;
    }
     if('3rd game' in scores){
        event.contestant1Set3Score = scores['3rd game'].team1;
        event.contestant2Set3Score = scores['3rd game'].team2;
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_bandy(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;

        if('match' in scores){
            event.contestant1H2Score = scores.match.team1 - scores['1st half'].team1;
            event.contestant2H2Score = scores.match.team2 - scores['1st half'].team2;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_baseball(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;

        if('game' in scores){
            event.contestant1H2Score = scores.game.team1 - scores['1st half'].team1;
            event.contestant2H2Score = scores.game.team2 - scores['1st half'].team2;
        }
    }

    if('game' in scores){
        event.contestant1RegulationScore = scores.game.team1;
        event.contestant2RegulationScore = scores.game.team2;

        event.contestant1FinalScore = scores.game.team1;
        event.contestant2FinalScore = scores.game.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_basketball(event, scores, callback){

    if('1st quarter' in scores){
        event.contestant1Q1Score = scores['1st quarter'].team1;
        event.contestant2Q1Score = scores['1st quarter'].team2;

        if('1st half' in scores){
            event.contestant1Q2Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
            event.contestant2Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
        }
    }

    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;
    }

    if('game' in scores){
        event.contestant1RegulationScore = scores.game.team1;
        event.contestant2RegulationScore = scores.game.team2;
        event.contestant1FinalScore = scores.game.team1;
        event.contestant2FinalScore = scores.game.team2;
        event.scores = true;
    }

    callback();
}

function insertScores_euroBasketball(event, scores, callback){

    if('1st quarter' in scores){
        event.contestant1Q1Score = scores['1st quarter'].team2;
        event.contestant2Q1Score = scores['1st quarter'].team1;

        if('1st half' in scores){
            event.contestant1Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
            event.contestant2Q2Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
        }
    }

    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team2;
        event.contestant2H1Score = scores['1st half'].team1;
    }

    if('game' in scores){
        event.contestant1RegulationScore = scores.game.team2;
        event.contestant2RegulationScore = scores.game.team1;
        event.contestant1FinalScore = scores.game.team2;
        event.contestant2FinalScore = scores.game.team1;
        event.scores = true;
    }

    callback();
}

function insertScores_beachVolleyball(event, scores, callback){
    if('1st set' in scores){
        event.contestant1Set1Score = scores['1st set'].team1;
        event.contestant2Set1Score = scores['1st set'].team2;
    }
    if('2nd set' in scores){
        event.contestant1Set2Score = scores['2nd set'].team1;
        event.contestant2Set2Score = scores['2nd set'].team2;
    }
    if('3rd set' in scores){
        event.contestant1Set3Score = scores['3rd set'].team1;
        event.contestant2Set3Score = scores['3rd set'].team2;
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_boxing(event, scores, callback){
    if('match' in scores){
        event.contestant1FinalScore = scores.match.team2;
        event.contestant2FinalScore = scores.match.team1;
        event.contestant1RegulationScore = scores.match.team2;
        event.contestant2RegulationScore = scores.match.team1;
        event.scores = true;
    }
    callback();
}

function insertScores_chess(event, scores, callback){
    if('match' in scores){
        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_cricket(event, scores, callback){
    if('1st inning' in scores){
        event.contestant1Set1Score = scores['1st inning'].team2;
        event.contestant2Set1Score = scores['1st inning'].team1;
    }
    if('2nd inning' in scores){
        event.contestant1Set2Score = scores['2nd inning'].team2;
        event.contestant2Set2Score = scores['2nd inning'].team1;
    }

    if('match' in scores){
        event.contestant1FinalScore = scores.match.team2;
        event.contestant2FinalScore = scores.match.team1;
        event.contestant1RegulationScore = scores.match.team2;
        event.contestant2RegulationScore = scores.match.team1;
        event.scores = true;
    }
    callback();
}

function insertScores_curling(event, scores, callback){
    if('1st end' in scores){
        event.contestant1H1Score = scores['1st end'].team1;
        event.contestant2H1Score = scores['1st end'].team2;
        if('game' in scores){
            event.contestant1H2Score = scores.game.team1 - scores['1st end'].team1;
            event.contestant2H2Score = scores.game.team2 - scores['1st end'].team2;
        }
    }

    if('game' in scores){
        event.contestant1FinalScore = scores.game.team1;
        event.contestant2FinalScore = scores.game.team2;
        event.contestant1RegulationScore = scores.game.team1;
        event.contestant2RegulationScore = scores.game.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_darts(event, scores, callback){
    if('1st set' in scores){
        event.contestant1Set1Score = scores['1st set'].team2;
        event.contestant2Set1Score = scores['1st set'].team1;
    }
    if('2nd set' in scores){
        event.contestant1Set2Score = scores['2nd set'].team2;
        event.contestant2Set2Score = scores['2nd set'].team1;
    }
    if('3rd set' in scores){
        event.contestant1Set3Score = scores['3rd set'].team2;
        event.contestant2Set3Score = scores['3rd set'].team1;
    }
    if('4th set' in scores){
        event.contestant1Set4Score = scores['4th set'].team2;
        event.contestant2Set4Score = scores['4th set'].team1;
    }
    if('5th set' in scores){
        event.contestant1Set5Score = scores['5th set'].team2;
        event.contestant2Set5Score = scores['5th set'].team1;
    }
    if('match' in scores){
        event.contestant1FinalScore = scores.match.team2;
        event.contestant2FinalScore = scores.match.team1;
        event.contestant1RegulationScore = scores.match.team2;
        event.contestant2RegulationScore = scores.match.team1;
        event.scores = true;
    }
    callback();
}

function insertScores_dartsLegs(event, scores, callback){
    if('1st leg' in scores){
        event.contestant1Set1Score = scores['1st leg'].team1;
        event.contestant2Set1Score = scores['1st leg'].team2;
    }
    if('2nd leg' in scores){
        event.contestant1Set2Score = scores['2nd leg'].team1;
        event.contestant2Set2Score = scores['2nd leg'].team2;
    }
    if('3rd leg' in scores){
        event.contestant1Set3Score = scores['3rd leg'].team1;
        event.contestant2Set3Score = scores['3rd leg'].team2;
    }
    if('4th leg' in scores){
        event.contestant1Set4Score = scores['4th leg'].team1;
        event.contestant2Set4Score = scores['4th leg'].team2;
    }
    if('5th leg' in scores){
        event.contestant1Set5Score = scores['5th leg'].team1;
        event.contestant2Set5Score = scores['5th leg'].team2;
    }
    if('6th leg' in scores){
        event.contestant1Set5Score = scores['5th leg'].team1;
        event.contestant2Set5Score = scores['5th leg'].team2;
    }
    if('match' in scores){
        event.contestant1FinalScore = scores.game.team1;
        event.contestant2FinalScore = scores.game.team2;
        event.contestant1RegulationScore = scores.game.team1;
        event.contestant2RegulationScore = scores.game.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_dotaLeague(event, scores, scoreType, callback){
    if('match' in scores){
        if(scoreType){
            switch(scoreType.toLowerCase()){

                //Overall
                case '1st blood':
                    event.contestant1FirstBlood = scores.match.team2;
                    event.contestant2FirstBlood = scores.match.team1;
                    break;
                case '1st to 5 kills':
                    event.contestant1Kills5First = scores.match.team2;
                    event.contestant2Kills5First = scores.match.team1;
                    break;
                case '1st to 10 kills':
                    event.contestant1Kills10First = scores.match.team2;
                    event.contestant2Kills10First = scores.match.team1;
                    break;
                case 'kills':
                    event.contestant1RegulationScore = scores.match.team2;
                    event.contestant2RegulationScore = scores.match.team1;
                    event.contestant1FinalScore = scores.match.team2;
                    event.contestant2FinalScore = scores.match.team1;
                    event.scores = true;
                    break;

                //Map Winners
                case 'map 1':
                case '1st map':
                    event.contestant1Map1Winner = scores.match.team2;
                    event.contestant2Map1Winner = scores.match.team1;
                    break;
                case 'map 2':
                case '2nd map':
                    event.contestant1Map2Winner = scores.match.team2;
                    event.contestant2Map2Winner = scores.match.team1;
                    break;
                case 'map 3':
                case '3rd map':
                    event.contestant1Map3Winner = scores.match.team2;
                    event.contestant2Map3Winner = scores.match.team1;
                    break;
                case 'map 4':
                case '4th map':
                    event.contestant1Map4Winner = scores.match.team2;
                    event.contestant2Map4Winner = scores.match.team1;
                    break;
                case 'map 5':
                case '5th map':
                    event.contestant1Map5Winner = scores.match.team2;
                    event.contestant2Map5Winner = scores.match.team1;
                    break;

                //1st to 10 kills per map
                case 'map 1, 1st to 10 kills':
                case '1st map, 1st to 10 kills':
                    event.contestant1Map1Kills10First = scores.match.team2;
                    event.contestant2Map1Kills10First = scores.match.team1;
                    break;
                case 'map 2, 1st to 10 kills':
                case '2nd map, 1st to 10 kills':
                    event.contestant1Map2Kills10First = scores.match.team2;
                    event.contestant2Map2Kills10First = scores.match.team1;
                    break;
                case 'map 3, 1st to 10 kills':
                case '3rd map, 1st to 10 kills':
                    event.contestant1Map3Kills10First = scores.match.team2;
                    event.contestant2Map3Kills10First = scores.match.team1;
                    break;
                case 'map 4, 1st to 10 kills':
                case '4th map, 1st to 10 kills':
                    event.contestant1Map4Kills10First = scores.match.team2;
                    event.contestant2Map4Kills10First = scores.match.team1;
                    break;
                case 'map 5, 1st to 10 kills':
                case '5th map, 1st to 10 kills':
                    event.contestant1Map5Kills10First = scores.match.team2;
                    event.contestant2Map5Kills10First = scores.match.team1;
                    break;

                //1st to 10 kills per map
                case 'map 1, 1st to 5 kills':
                case '1st map, 1st to 5 kills':
                    event.contestant1Map1Kills5First = scores.match.team2;
                    event.contestant2Map1Kills5First = scores.match.team1;
                    break;
                case 'map 2, 1st to 5 kills':
                case '2nd map, 1st to 5 kills':
                    event.contestant1Map2Kills5First = scores.match.team2;
                    event.contestant2Map2Kills5First = scores.match.team1;
                    break;
                case 'map 3, 1st to 5 kills':
                case '3rd map, 1st to 5 kills':
                    event.contestant1Map3Kills5First = scores.match.team2;
                    event.contestant2Map3Kills5First = scores.match.team1;
                    break;
                case 'map 4, 1st to 5 kills':
                case '4th map, 1st to 5 kills':
                    event.contestant1Map4Kills5First = scores.match.team2;
                    event.contestant2Map4Kills5First = scores.match.team1;
                    break;
                case 'map 5, 1st to 5 kills':
                case '5th map, 1st to 5 kills':
                    event.contestant1Map5Kills5First = scores.match.team2;
                    event.contestant2Map5Kills5First = scores.match.team1;
                    break;

                //1st blood per map
                case 'map 1, 1st blood':
                case '1st map, 1st blood':
                    event.contestant1Map1FirstBlood = scores.match.team2;
                    event.contestant2Map1FirstBlood = scores.match.team1;
                    break;
                case 'map 2, 1st blood':
                case '2nd map, 1st blood':
                    event.contestant1Set2FirstBlood = scores.match.team2;
                    event.contestant2Set2FirstBlood = scores.match.team1;
                    break;
                case 'map 3, 1st blood':
                case '3rd map, 1st blood':
                    event.contestant1Map3FirstBlood = scores.match.team2;
                    event.contestant2Map3FirstBlood = scores.match.team1;
                    break;
                case 'map 4, 1st blood':
                case '4th map, 1st blood':
                    event.contestant1Map4FirstBlood = scores.match.team2;
                    event.contestant2Map4FirstBlood = scores.match.team1;
                    break;
                case 'map 5, 1st blood':
                case '5th map, 1st blood':
                    event.contestant1Map5FirstBlood = scores.match.team2;
                    event.contestant2Map5FirstBlood = scores.match.team1;
                    break;

                //kills per map
                case 'map 1, kills':
                case '1st map, kills':
                    event.contestant1Map1Score = scores.match.team2;
                    event.contestant2Map1Score = scores.match.team1;
                    break;
                case 'map 2, kills':
                case '2nd map, kills':
                    event.contestant1Map2Score = scores.match.team2;
                    event.contestant2Map2Score = scores.match.team1;
                    break;
                case 'map 3, kills':
                case '3rd map, kills':
                    event.contestant1Map3Score = scores.match.team2;
                    event.contestant2Map3Score = scores.match.team1;
                    break;
                case 'map 4, kills':
                case '4th map, kills':
                    event.contestant1Map4Score = scores.match.team2;
                    event.contestant2Map4Score = scores.match.team1;
                    break;
                case 'map 5, kills':
                case '5th map, kills':
                    event.contestant1Map5Score = scores.match.team2;
                    event.contestant2Map5Score = scores.match.team1;
                    break;

                //series
                case 'series':
                    event.contestant1MapsWon = scores.match.team2;
                    event.contestant2MapsWon = scores.match.team1;
                    event.scores = true;
                    break;
            }
        } else {
            event.contestant1MatchWinner = scores.match.team2;
            event.contestant2MatchWinner = scores.match.team1;
            event.scores = true;
        }
    }
    callback();
}

function insertScores_starcraft(event, scores, scoreType, callback){
    if('match' in scores){
        if(scoreType){
            switch(scoreType.toLowerCase()){
                //Map Winners
                case 'ace':
                    event.contestant1AceWinner = scores.match.team2;
                    event.contestant2AceWinner = scores.match.team1;
                    break;
                case 'map 1':
                case '1st map':
                    event.contestant1Map1Winner = scores.match.team2;
                    event.contestant2Map1Winner = scores.match.team1;
                    break;
                case 'map 2':
                case '2nd map':
                    event.contestant1Map2Winner = scores.match.team2;
                    event.contestant2Map2Winner = scores.match.team1;
                    break;
                case 'map 3':
                case '3rd map':
                    event.contestant1Map3Winner = scores.match.team2;
                    event.contestant2Map3Winner = scores.match.team1;
                    break;
                case 'map 4':
                case '4th map':
                    event.contestant1Map4Winner = scores.match.team2;
                    event.contestant2Map4Winner = scores.match.team1;
                    break;
                case 'map 5':
                case '5th map':
                    event.contestant1Map5Winner = scores.match.team2;
                    event.contestant2Map5Winner = scores.match.team1;
                    break;
                case 'map 6':
                case '6th map':
                    event.contestant1Map6Winner = scores.match.team2;
                    event.contestant2Map6Winner = scores.match.team1;
                    break;
                case 'map 7':
                case '7th map':
                    event.contestant1Map7Winner = scores.match.team2;
                    event.contestant2Map7Winner = scores.match.team1;
                    break;
                case 'series':
                    event.contestant1MapsWon = scores.match.team2;
                    event.contestant2MapsWon = scores.match.team1;
                    event.scores = true;
                    break;
            }
        } else {
            event.contestant1RegulationScore = scores.match.team2;
            event.contestant2RegulationScore = scores.match.team1;
            event.contestant1FinalScore = scores.match.team2;
            event.contestant2FinalScore = scores.match.team1;
            event.scores = true;
        }
    }
    callback();
}

function insertScores_csGo(event, scores, scoreType, callback){
    if('match' in scores){
        if(scoreType){
            switch(scoreType.toLowerCase()){
                //cache, dust2, overpass, inferno, cobble., train, mirage

                case 'map 1':
                case '1st map':
                    event.contestant1Map1Score = scores.match.team2;
                    event.contestant2Map1Score = scores.match.team1;
                    break;
                case 'map 2':
                case '2nd map':
                    event.contestant1Map2Score = scores.match.team2;
                    event.contestant2Map2Score = scores.match.team1;
                    break;
                case 'map 3':
                case '3rd map':
                    event.contestant1Map3Score = scores.match.team2;
                    event.contestant2Map3Score = scores.match.team1;
                    break;
                case 'map 4':
                case '4th map':
                    event.contestant1Map4Score = scores.match.team2;
                    event.contestant2Map4Score = scores.match.team1;
                    break;
                case 'map 5':
                case '5th map':
                    event.contestant1Map5Score = scores.match.team2;
                    event.contestant2Map5Score = scores.match.team1;
                    break;
                case 'cache':
                    event.contestant1CacheScore = scores.match.team2;
                    event.contestant2CacheScore = scores.match.team2;
                    break;
                case 'dust 2':
                case 'dust2':
                    event.contestant1Dust2Score = scores.match.team2;
                    event.contestant2Dust2Score = scores.match.team2;
                    break;
                case 'overpass':
                    event.contestant1OverpassScore = scores.match.team2;
                    event.contestant2OverpassScore = scores.match.team2;
                    break;
                case 'inferno':
                    event.contestant1InfernoScore = scores.match.team2;
                    event.contestant2InfernoScore = scores.match.team2;
                    break;
                case 'cobble':
                case 'cobble.':
                    event.contestant1CobbleScore = scores.match.team2;
                    event.contestant2CobbleScore = scores.match.team2;
                    break;
                case 'train':
                    event.contestant1TrainScore = scores.match.team2;
                    event.contestant2TrainScore = scores.match.team2;
                    break;
                case 'mirage':
                    event.contestant1MirageScore = scores.match.team2;
                    event.contestant2MirageScore = scores.match.team2;
                    break;

                case 'map 1, 1st round':
                    event.contestant1Map1FirstRd = scores.match.team2;
                    event.contestant2Map1FirstRd = scores.match.team1;
                    break;
                case 'map 2, 1st round':
                    event.contestant1Map2FirstRd = scores.match.team2;
                    event.contestant2Map2FirstRd = scores.match.team1;
                    break;
                case 'map 3, 1st round':
                    event.contestant1Map3FirstRd = scores.match.team2;
                    event.contestant2Map3FirstRd = scores.match.team1;
                    break;
                case 'map 4, 1st round':
                    event.contestant1Map4FirstRd = scores.match.team2;
                    event.contestant2Map4FirstRd = scores.match.team1;
                    break;
                case 'map 5, 1st round':
                    event.contestant1Map5FirstRd = scores.match.team2;
                    event.contestant2Map5FirstRd = scores.match.team1;
                    break;
                case 'cache, 1st round':
                    event.contestant1CacheFirstRd = scores.match.team2;
                    event.contestant2CacheFirstRd = scores.match.team1;
                    break;
                case 'dust 2, 1st round':
                case 'dust2, 1st round':
                    event.contestant1Dust2FirstRd = scores.match.team2;
                    event.contestant2Dust2FirstRd = scores.match.team1;
                    break;
                case 'overpass, 1st round':
                    event.contestant1OverpassFirstRd = scores.match.team2;
                    event.contestant2OverpassFirstRd = scores.match.team1;
                    break;
                case 'inferno, 1st round':
                    event.contestant1InfernoFirstRd = scores.match.team2;
                    event.contestant2InfernoFirstRd = scores.match.team1;
                    break;
                case 'cobble, 1st round':
                case 'cobble., 1st round':
                    event.contestant1CobbleFirstRd = scores.match.team2;
                    event.contestant2CobbleFirstRd = scores.match.team1;
                    break;
                case 'train, 1st round':
                    event.contestant1TrainFirstRd = scores.match.team2;
                    event.contestant2TrainFirstRd = scores.match.team1;
                    break;
                case 'mirage, 1st round':
                    event.contestant1MirageFirstRd = scores.match.team2;
                    event.contestant2MirageFirstRd = scores.match.team1;
                    break;
                case 'map 1, 1st to 5 rounds':
                    event.contestant1Map1FirstTo5Rds = scores.match.team2;
                    event.contestant2Map1FirstTo5Rds = scores.match.team1;
                    break;
                case 'map 2, 1st to 5 rounds':
                    event.contestant1Map2FirstTo5Rds = scores.match.team2;
                    event.contestant2Map2FirstTo5Rds = scores.match.team1;
                    break;
                case 'map 3, 1st to 5 rounds':
                    event.contestant1Map3FirstTo5Rds = scores.match.team2;
                    event.contestant2Map3FirstTo5Rds = scores.match.team1;
                    break;
                case 'map 4, 1st to 5 rounds':
                    event.contestant1Map4FirstTo5Rds = scores.match.team2;
                    event.contestant2Map4FirstTo5Rds = scores.match.team1;
                    break;
                case 'map 5, 1st to 5 rounds':
                    event.contestant1Map5FirstTo5Rds = scores.match.team2;
                    event.contestant2Map5FirstTo5Rds = scores.match.team1;
                    break;
                case 'cache, 1st to 5 rounds':
                    event.contestant1CacheFirstTo5Rds = scores.match.team2;
                    event.contestant2CacheFirstTo5Rds = scores.match.team1;
                    break;
                case 'dust2, 1st to 5 rounds':
                case 'dust 2, 1st to 5 rounds':
                    event.contestant1Dust2FirstTo5Rds = scores.match.team2;
                    event.contestant2Dust2FirstTo5Rds = scores.match.team1;
                    break;
                case 'overpass, 1st to 5 rounds':
                    event.contestant1OverpassFirstTo5Rds = scores.match.team2;
                    event.contestant2OverpassFirstTo5Rds = scores.match.team1;
                    break;
                case 'inferno, 1st to 5 rounds':
                    event.contestant1InfernoFirstTo5Rds = scores.match.team2;
                    event.contestant2InfernoFirstTo5Rds = scores.match.team1;
                    break;
                case 'cobble, 1st to 5 rounds':
                case 'cobble., 1st to 5 rounds':
                    event.contestant1CobbleFirstTo5Rds = scores.match.team2;
                    event.contestant2CobbleFirstTo5Rds = scores.match.team1;
                    break;
                case 'train, 1st to 5 rounds':
                    event.contestant1TrainFirstTo5Rds = scores.match.team2;
                    event.contestant2TrainFirstTo5Rds = scores.match.team1;
                    break;
                case 'mirage, 1st to 5 rounds':
                    event.contestant1MirageFirstTo5Rds = scores.match.team2;
                    event.contestant2MirageFirstTo5Rds = scores.match.team1;
                    break;
                case 'series':
                    event.contestant1MapsWon = scores.match.team2;
                    event.contestant2MapsWon = scores.match.team1;
                    event.scores = true;
                    break;
            }
        } else {
            event.contestant1RegulationScore = scores.match.team2;
            event.contestant2RegulationScore = scores.match.team1;
            event.contestant1FinalScore = scores.match.team2;
            event.contestant2FinalScore = scores.match.team1;
            event.scores = true;
        }
    }
    callback();
}

function insertScores_fieldHockey(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;

        if('match' in scores){
            event.contestant1H2Score = scores.match.team1 - scores['1st half'].team1;
            event.contestant2H2Score = scores.match.team2 - scores['1st half'].team2;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_football(event, scores, callback){

    if('1st quarter' in scores){
        event.contestant1Q1Score = scores['1st quarter'].team1;
        event.contestant2Q1Score = scores['1st quarter'].team2;

        if('1st half' in scores){
            event.contestant1Q2Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
            event.contestant2Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
        }
    }

    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;
    }

    if('game' in scores){
        event.contestant1RegulationScore = scores.game.team1;
        event.contestant2RegulationScore = scores.game.team2;
        event.contestant1FinalScore = scores.game.team1;
        event.contestant2FinalScore = scores.game.team2;
        event.scores = true;
    }

    callback();
}

function insertScores_floorball(event, scores, callback){
    if('1st period' in scores){
        event.contestant1P1Score = scores['1st period'].team1;
        event.contestant2P1Score = scores['1st period'].team2;
    }
    if('2nd period' in scores){
        event.contestant1P2Score = scores['2nd period'].team1;
        event.contestant2P2Score = scores['2nd period'].team2;
    }
    if('3rd period' in scores){
        event.contestant1P3Score = scores['3rd period'].team1;
        event.contestant2P3Score = scores['3rd period'].team2;
    }
    if('match' in scores){
        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_futsal(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;

        if('match' in scores){
            event.contestant1H2Score = scores.match.team1 - scores['1st half'].team1;
            event.contestant2H2Score = scores.match.team2 - scores['1st half'].team2;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_handball(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team2;
        event.contestant2H1Score = scores['1st half'].team1;

        if('match' in scores){
            event.contestant1H2Score = scores.match.team2 - scores['1st half'].team2;
            event.contestant2H2Score = scores.match.team1 - scores['1st half'].team1;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team2;
        event.contestant2RegulationScore = scores.match.team1;

        event.contestant1FinalScore = scores.match.team2;
        event.contestant2FinalScore = scores.match.team1;
        event.scores = true;
    }
    callback();
}

function insertScores_hockey(event, scores, scoreType, callback){
    if(scoreType === 'regular time'){
        event.contestant1RegulationScore = scores.game.team1;
        event.contestant2RegulationScore = scores.game.team2;
    } else if(scoreType === 'ot included') {
        if('1st period' in scores){
            event.contestant1P1Score = scores['1st period'].team1;
            event.contestant2P1Score = scores['1st period'].team2;
            if('game' in scores){
                event.contestant1RegulationScore = scores.game.team1;
                event.contestant2RegulationScore = scores.game.team2;
                event.contestant1FinalScore = scores.game.team1;
                event.contestant2FinalScore = scores.game.team2;
                event.contestant1OTScore = event.contestant1FinalScore - event.contestant1RegulationScore;
                event.contestant2OTScore = event.contestant2FinalScore - event.contestant2RegulationScore;
                if(event.contestant1OTScore !== 0 || event.contestant2OTScore !== 0){
                    event.overtime = true;
                }
                event.scores = true;
            }
        }
    } else {
        if('1st period' in scores) {
            event.contestant1P1Score = scores['1st period'].team1;
            event.contestant2P1Score = scores['1st period'].team2;
        }

        if('game' in scores){
            event.contestant1RegulationScore = scores.game.team1;
            event.contestant2RegulationScore = scores.game.team2;
            event.contestant1FinalScore = scores.game.team1;
            event.contestant2FinalScore = scores.game.team2;
            event.scores = true;
        }

    }
    callback();
}

function insertScores_euroHockey(event, scores, scoreType, callback){
    if(scoreType === 'regular time'){
        event.contestant1RegulationScore = scores.game.team2;
        event.contestant2RegulationScore = scores.game.team1;
    } else if(scoreType === 'ot included') {
        if('1st period' in scores){
            event.contestant1P1Score = scores['1st period'].team2;
            event.contestant2P1Score = scores['1st period'].team1;
            if('game' in scores){
                event.contestant1RegulationScore = scores.game.team2;
                event.contestant2RegulationScore = scores.game.team1;
                event.contestant1FinalScore = scores.game.team2;
                event.contestant2FinalScore = scores.game.team1;
                event.contestant1OTScore = event.contestant1FinalScore - event.contestant1RegulationScore;
                event.contestant2OTScore = event.contestant2FinalScore - event.contestant2RegulationScore;
                if(event.contestant1OTScore !== 0 || event.contestant2OTScore !== 0){
                    event.overtime = true;
                }
                event.scores = true;
            }
        }
    } else {
        if('1st period' in scores) {
            event.contestant1P1Score = scores['1st period'].team2;
            event.contestant2P1Score = scores['1st period'].team1;
        }

        if('game' in scores){
            event.contestant1RegulationScore = scores.game.team2;
            event.contestant2RegulationScore = scores.game.team1;
            event.contestant1FinalScore = scores.game.team2;
            event.contestant2FinalScore = scores.game.team1;
            event.scores = true;
        }

    }
    callback();
}

function insertScores_horseRacing(event, scores, callback){
    if('race' in scores){
        event.contestant1FinalScore = scores.race.team1;
        event.contestant2FinalScore = scores.race.team2;
        event.contestant1RegulationScore = scores.race.team1;
        event.contestant2RegulationScore = scores.race.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_lacrosse(event, scores, callback){
    if('1st quarter' in scores){
        event.contestant1Q1Score = scores['1st quarter'].team1;
        event.contestant2Q1Score = scores['1st quarter'].team2;

        if('1st half' in scores){
            event.contestant1Q2Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
            event.contestant2Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
        }
    }

    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;
    }

    if('game' in scores){
        event.contestant1RegulationScore = scores.game.team1;
        event.contestant2RegulationScore = scores.game.team2;
        event.contestant1FinalScore = scores.game.team1;
        event.contestant2FinalScore = scores.game.team2;
        event.scores = true;
    }

    callback();
}

function insertScores_mma(event, scores, callback){
    if('fight' in scores){
        event.contestant1FinalScore = scores.fight.team2;
        event.contestant2FinalScore = scores.fight.team1;
        event.contestant1RegulationScore = scores.fight.team2;
        event.contestant2RegulationScore = scores.fight.team1;
        event.scores = true;
    }
    callback();
}

function insertScores_otherSports(event, scores, callback){
    if('game' in scores){
        event.contestant1FinalScore = scores.game.team1;
        event.contestant2FinalScore = scores.game.team2;
        event.contestant1RegulationScore = scores.game.team1;
        event.contestant2RegulationScore = scores.game.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_politics(event, scores, callback){
    if('election' in scores){
        event.contestant1FinalScore = scores.election.team1;
        event.contestant2FinalScore = scores.election.team2;
        event.contestant1RegulationScore = scores.election.team1;
        event.contestant2RegulationScore = scores.election.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_rinkHockey(event, scores, callback){
    if('1st period' in scores){
        event.contestant1P1Score = scores['1st period'].team1;
        event.contestant2P1Score = scores['1st period'].team2;
    }
    if('2nd period' in scores){
        event.contestant1P2Score = scores['2nd period'].team1;
        event.contestant2P2Score = scores['2nd period'].team2;
    }
    if('match' in scores){
        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_rugby(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team2;
        event.contestant2H1Score = scores['1st half'].team1;

        if('match' in scores){
            event.contestant1H2Score = scores.match.team2 - scores['1st half'].team2;
            event.contestant2H2Score = scores.match.team1 - scores['1st half'].team1;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team2;
        event.contestant2RegulationScore = scores.match.team1;

        event.contestant1FinalScore = scores.match.team2;
        event.contestant2FinalScore = scores.match.team1;
        event.scores = true;
    }
    callback();
}

function insertScores_snooker(event, scores, callback){
    if('1st frame' in scores){
        event.contestant1Set1Score = scores['1st frame'].team1;
        event.contestant2Set1Score = scores['1st frame'].team2;
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_soccer(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team2;
        event.contestant2H1Score = scores['1st half'].team1;

        if('match' in scores){
            event.contestant1H2Score = scores.match.team2 - scores['1st half'].team2;
            event.contestant2H2Score = scores.match.team1 - scores['1st half'].team1;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team2;
        event.contestant2RegulationScore = scores.match.team1;

        event.contestant1FinalScore = scores.match.team2;
        event.contestant2FinalScore = scores.match.team1;
        event.scores = true;
    }
    callback();
}

function insertScores_softball(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;

        if('match' in scores){
            event.contestant1H2Score = scores.match.team1 - scores['1st half'].team1;
            event.contestant2H2Score = scores.match.team2 - scores['1st half'].team2;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_squash(event, scores, callback){
    if('1st game' in scores){
        event.contestant1Set1Score = scores['1st game'].team1;
        event.contestant2Set2Score = scores['1st game'].team2;
    }
    if('2nd game' in scores){
        event.contestant1Set2Score = scores['2nd game'].team1;
        event.contestant2Set2Score = scores['2nd game'].team2;
    }
    if('3rd game' in scores){
        event.contestant1Set3Score = scores['3rd game'].team1;
        event.contestant2Set3Score = scores['3rd game'].team2;
    }
    if('4th game' in scores){
        event.contestant1Set4Score = scores['4th game'].team1;
        event.contestant2Set4Score = scores['4th game'].team2;
    }
    if('5th game' in scores){
        event.contestant1Set5Score = scores['5th game'].team1;
        event.contestant2Set5Score = scores['5th game'].team2;
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_tableTennis(event, scores, callback){
    if('1st game' in scores){
        event.contestant1Set1Score = scores['1st game'].team1;
        event.contestant2Set2Score = scores['1st game'].team2;
    }
    if('2nd game' in scores){
        event.contestant1Set2Score = scores['2nd game'].team1;
        event.contestant2Set2Score = scores['2nd game'].team2;
    }
    if('3rd game' in scores){
        event.contestant1Set3Score = scores['3rd game'].team1;
        event.contestant2Set3Score = scores['3rd game'].team2;
    }
    if('4th game' in scores){
        event.contestant1Set4Score = scores['4th game'].team1;
        event.contestant2Set4Score = scores['4th game'].team2;
    }
    if('5th game' in scores){
        event.contestant1Set5Score = scores['5th game'].team1;
        event.contestant2Set5Score = scores['5th game'].team2;
    }
    if('6th game' in scores){
        event.contestant1Set6Score = scores['6th game'].team1;
        event.contestant2Set6Score = scores['6th game'].team2;
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_tennis(event, scores, scoreType, callback){
    console.log('scores', scores, 'scoreType', scoreType);
    if('match' in scores){
        if(scoreType){
            switch(scoreType.toLowerCase()){
                case '+1.5 sets':
                    break;
                case '-1.5 sets':
                    break;
            }
        } else {
            if('1st set winner' in scores){
                event.contestant1Set1Score = scores['1st set winner'].team2;
                event.contestant2Set1Score = scores['1st set winner'].team1;
            }
            if('2nd set winner' in scores){
                event.contestant1Set2Score = scores['2nd set winner'].team2;
                event.contestant2Set2Score = scores['2nd set winner'].team1;
            }
            if('3rd set winner' in scores){
                event.contestant1Set3Score = scores['3rd set winner'].team2;
                event.contestant2Set3Score = scores['3rd set winner'].team1;
            }
            if('4th set winner' in scores){
                event.contestant1Set4Score = scores['4th set winner'].team2;
                event.contestant2Set4Score = scores['4th set winner'].team1;
            }
            if('5th set winner' in scores){
                event.contestant1Set5Score = scores['5th set winner'].team2;
                event.contestant2Set5Score = scores['5th set winner'].team1;
            }
            if('match' in scores){
                event.contestant1RegulationScore = scores.match.team2;
                event.contestant2RegulationScore = scores.match.team1;

                event.contestant1FinalScore = scores.match.team2;
                event.contestant2FinalScore = scores.match.team1;
                event.scores = true;
            }
        }
    }
    callback();
}

function insertScores_volleyball(event, scores, callback){

    if('1st set' in scores){
        event.contestant1Set1Score = scores['1st set'].team2;
        event.contestant2Set2Score = scores['1st set'].team1;
    }
    if('2nd set' in scores){
        event.contestant1Set2Score = scores['2nd set'].team2;
        event.contestant2Set2Score = scores['2nd set'].team1;
    }
    if('3rd set' in scores){
        event.contestant1Set3Score = scores['3rd set'].team2;
        event.contestant2Set3Score = scores['3rd set'].team1;
    }
    if('4th set' in scores){
        event.contestant1Set4Score = scores['4th set'].team2;
        event.contestant2Set4Score = scores['4th set'].team1;
    }
    if('5th set' in scores){
        event.contestant1Set5Score = scores['5th set'].team2;
        event.contestant2Set5Score = scores['5th set'].team1;
    }
    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team2;
        event.contestant2RegulationScore = scores.match.team1;

        event.contestant1FinalScore = scores.match.team2;
        event.contestant2FinalScore = scores.match.team1;
        event.scores = true;
    }
    callback();

}

function insertScores_volleyballPoints(event, scores, callback){


    if('1st set' in scores){
        event.contestant1Set1Score = scores['1st set'].team1;
        event.contestant2Set2Score = scores['1st set'].team2;
    }
    if('2nd set' in scores){
        event.contestant1Set2Score = scores['2nd set'].team1;
        event.contestant2Set2Score = scores['2nd set'].team2;
    }
    if('3rd set' in scores){
        event.contestant1Set3Score = scores['3rd set'].team1;
        event.contestant2Set3Score = scores['3rd set'].team2;
    }
    if('4th set' in scores){
        event.contestant1Set4Score = scores['4th set'].team1;
        event.contestant2Set4Score = scores['4th set'].team2;
    }
    if('5th set' in scores){
        event.contestant1Set5Score = scores['5th set'].team1;
        event.contestant2Set5Score = scores['5th set'].team2;
    }
    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_waterPolo(event, scores, callback){

    if('1st period' in scores){
        event.contestant1Set1Score = scores['1st period'].team1;
        event.contestant2Set2Score = scores['1st period'].team2;
    }
    if('2nd period' in scores){
        event.contestant1Set2Score = scores['2nd period'].team1;
        event.contestant2Set2Score = scores['2nd period'].team2;
    }
    if('3rd period' in scores){
        event.contestant1Set3Score = scores['3rd period'].team1;
        event.contestant2Set3Score = scores['3rd period'].team2;
    }
    if('4th period' in scores){
        event.contestant1Set4Score = scores['4th period'].team1;
        event.contestant2Set4Score = scores['4th period'].team2;
    }
    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_padelTennis(event, scores, callback){
    if('1st set winner' in scores){
        event.contestant1Set1Score = scores['1st set winner'].team1;
        event.contestant2Set2Score = scores['1st set winner'].team2;
    }
    if('2nd set winner' in scores){
        event.contestant1Set2Score = scores['2nd set winner'].team1;
        event.contestant2Set2Score = scores['2nd set winner'].team2;
    }
    if('3rd set winner' in scores){
        event.contestant1Set3Score = scores['3rd set winner'].team1;
        event.contestant2Set3Score = scores['3rd set winner'].team2;
    }
    if('match' in scores){
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;

        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_aussieRules(event, scores, callback){
    if('1st quarter' in scores){
        event.contestant1Q1Score = scores['1st quarter'].team2;
        event.contestant2Q1Score = scores['1st quarter'].team1;

        if('1st half' in scores){
            event.contestant1Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
            event.contestant2Q2Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
        }
    }

    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team2;
        event.contestant2H1Score = scores['1st half'].team1;
    }

    if('game' in scores){
        event.contestant1RegulationScore = scores.game.team2;
        event.contestant2RegulationScore = scores.game.team1;
        event.contestant1FinalScore = scores.game.team2;
        event.contestant2FinalScore = scores.game.team1;
        event.scores = true;
    }

    callback();
}

function insertScores_matchups(event, scores, callback){
    if('matchups' in scores){
        event.contestant1FinalScore = scores.matchups.team2;
        event.contestant2FinalScore = scores.matchups.team1;
        event.contestant1RegulationScore = scores.matchups.team2;
        event.contestant2RegulationScore = scores.matchups.team1;
        event.scores = true;
    }
    callback();
}

function insertScores_golf(event, scores, callback){
    if('matchups' in scores){
        event.contestant1FinalScore = scores.matchups.team2;
        event.contestant2FinalScore = scores.matchups.team1;
        event.contestant1RegulationScore = scores.matchups.team2;
        event.contestant2RegulationScore = scores.matchups.team1;
        event.scores = true;
    }
    callback();
}

function insertScores(event, scores, sportName, leagueName, scoreType, callback){
    //console.log('scores', scores);
    //console.log('scoreType', scoreType);
    switch(sportName){
        case 'Badminton':
            insertScores_badminton(event, scores, callback);
            break;
        case 'Bandy':
            insertScores_bandy(event, scores, callback);
            break;
        case 'Baseball':
            insertScores_baseball(event, scores, callback);
            break;
        case 'Basketball':
            switch(leagueName){
                case 'NCAAB':
                case 'NBA':
                case 'NBA Preseason':
                    insertScores_basketball(event, scores, callback);
                    break;
                default:
                    insertScores_euroBasketball(event, scores, callback);
                    break;
            }
            break;
        case 'Beach Volleyball':
            insertScores_beachVolleyball(event, scores, callback);
            break;
        case 'Boxing':
            insertScores_boxing(event, scores, callback);
            break;
        case 'Chess':
            insertScores_chess(event, scores, callback);
            break;
        case 'Cricket':
            insertScores_cricket(event, scores, callback);
            break;
        case 'Curling':
            insertScores_curling(event, scores, callback);
            break;
        case 'Darts':
            insertScores_darts(event, scores, callback);
            break;
        case 'Darts (Legs)':
            insertScores_dartsLegs(event, scores, callback);
            break;
        case 'E Sports':
            var leagueGroupName = LeagueBl.getEsportsGroupName(leagueName);
            switch(leagueGroupName){
                case 'starcraft 2':
                    insertScores_starcraft(event, scores, scoreType, callback);
                    break;
                case 'dota 2':
                case 'league of legends':
                    insertScores_dotaLeague(event, scores, scoreType, callback);
                    break;
                case 'cs:go':
                    insertScores_csGo(event, scores, scoreType, callback);
                    break;
            }

            break;
        case 'Field Hockey':
            insertScores_fieldHockey(event, scores, callback);
            break;
        case 'Floorball':
            insertScores_floorball(event, scores, callback);
            break;
        case 'Football':
            insertScores_football(event, scores, callback);
            break;
        case 'Futsal':
            insertScores_futsal(event, scores, callback);
            break;
        case 'Handball':
            insertScores_handball(event, scores, callback);
            break;
        case 'Hockey':
            switch(leagueName){
                case 'NHL':
                case 'NHL Preseason':
                case 'NHL Regular Time':
                case 'NHL - Regulation Time':
                case 'NCAA':
                case 'NCAA OT Included':
                case 'NCAA Regular Time':
                    insertScores_hockey(event, scores, scoreType, callback);
                    break;
                default:
                    insertScores_euroHockey(event, scores, scoreType, callback);
                    break;
            }
            break;
        case 'Horse Racing':
            insertScores_horseRacing(event, scores, callback);
            break;
        case 'Lacrosse':
            insertScores_lacrosse(event, scores, callback);
            break;
        case 'Mixed Martial Arts':
            insertScores_mma(event, scores, callback);
            break;
        case 'Other Sports':
            insertScores_otherSports(event, scores, callback);
            break;
        case 'Politics':
            insertScores_politics(event, scores, callback);
            break;
        case 'Rink Hockey':
            insertScores_rinkHockey(event, scores, callback);
            break;
        case 'Rugby League':
        case 'Rugby Union':
            insertScores_rugby(event, scores, callback);
            break;
        case 'Snooker':
            insertScores_snooker(event, scores, callback);
            break;
        case 'Soccer':
            insertScores_soccer(event, scores, callback);
            break;
        case 'Softball':
            insertScores_softball(event, scores, callback);
            break;
        case 'Squash':
            insertScores_squash(event, scores, callback);
            break;
        case 'Table Tennis':
            insertScores_tableTennis(event, scores, callback);
            break;
        case 'Tennis':
            insertScores_tennis(event, scores, scoreType, callback);
            break;
        case 'Volleyball':
            insertScores_volleyball(event, scores, callback);
            break;
        case 'Volleyball (Points)':
            insertScores_volleyballPoints(event, scores, callback);
            break;
        case 'Water Polo':
            insertScores_waterPolo(event, scores, callback);
            break;
        case 'Padel Tennis':
            insertScores_padelTennis(event, scores, callback);
            break;
        case 'Aussie Rules Football':
            insertScores_aussieRules(event, scores, callback);
            break;
        case 'Aussie Rules':
            insertScores_aussieRules(event, scores, callback);
            break;
        case 'Golf':
            insertScores_golf(event, scores, callback);
            break;
        case 'Alpine Skiing':
        case 'Biathlon':
        case 'Ski Jumping':
        case 'Cross Country':
        case 'Formula 1':
        case 'Cycling':
        case 'Bobsleigh':
        case 'Figure Skating':
        case 'Freestyle Skiing':
        case 'Luge':
        case 'Nordic Combined':
        case 'Short Track':
        case 'Skeleton':
        case 'Snow Boarding':
        case 'SpeedSkating':
            insertScores_matchups(event, scores, callback);
            break;
    }
}

exports.insertScores = insertScores;
