'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    async = require('async');


function insertScores_badminton(event, scores, callback){
    callback();
}

function insertScores_bandy(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;

        if('match' in scores){
            event.contestant1H2Score = scores['match'].team1 - scores['1st half'].team1;
            event.contestant2H2Score = scores['match'].team2 - scores['1st half'].team2;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores['match'].team1;
        event.contestant2RegulationScore = scores['match'].team2;

        event.contestant1FinalScore = scores['match'].team1;
        event.contestant2FinalScore = scores['match'].team2;
        event.scores = true;
    }
    callback();
}

function insertScores_baseball(event, scores, callback){
    if('1st 5 innings' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;

        if('match' in scores){
            event.contestant1H2Score = scores['match'].team1 - scores['1st half'].team1;
            event.contestant2H2Score = scores['match'].team2 - scores['1st half'].team2;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores['match'].team1;
        event.contestant2RegulationScore = scores['match'].team2;

        event.contestant1FinalScore = scores['match'].team1;
        event.contestant2FinalScore = scores['match'].team2;
        event.scores = true;
    }
    callback();
}

function insertScores_basketball(event, scores, callback){

    if('1st quarter' in scores){
        event.contestant1Q1Score = scores['1st quarter'].team1;
        event.contestant1Q2Score = scores['1st quarter'].team2;

        if('1st half' in scores){
            event.contestant1Q1Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
            event.contestant1Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
        }
    }

    if('1st half' in scores){
        event.contestant1Q1Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
        event.contestant1Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
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

function insertScores_beachVolleyball(event, scores, callback){
    callback();
}

function insertScores_boxing(event, scores, callback){
    if('match' in scores){
        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;
    }
    callback();
}

function insertScores_chess(event, scores, callback){
    if('match' in scores){
        event.contestant1FinalScore = scores.match.team1;
        event.contestant2FinalScore = scores.match.team2;
        event.contestant1RegulationScore = scores.match.team1;
        event.contestant2RegulationScore = scores.match.team2;
    }
    callback();
}

function insertScores_cricket(event, scores, callback){
    if('match' in scores){

    }
    callback();
}

function insertScores_curling(event, scores, callback){
    if('game' in scores){

    }
    callback();
}

function insertScores_darts(event, scores, callback){
    if('match' in scores){

    }
    callback();
}

function insertScores_dartsLegs(event, scores, callback){
    if('match' in scores){

    }
    callback();
}

function insertScores_eSports(event, scores, scoreType, callback){
    if('match' in scores){
        if(scoreType){
            switch(scoreType){
                case 'map 1':
                    event.contestant1Set1Score = scores.match.team1;
                    event.contestant2Set1Score = scores.match.team2;
                    break;
                case 'map 2':
                    event.contestant1Set2Score = scores.match.team1;
                    event.contestant2Set2Score = scores.match.team2;
                    break;
                case 'map 3':
                    event.contestant1Set3Score = scores.match.team1;
                    event.contestant2Set3Score = scores.match.team2;
                    break;
                case 'map 1, 1st to 10 Kills':
                    event.contestant1Set1KillsFirst = scores.match.team1;
                    event.contestant2Set1KillsFirst = scores.match.team2;
                    break;
                case 'map 2, 1st to 10 Kills':
                    event.contestant1Set2KillsFirst = scores.match.team1;
                    event.contestant2Set2KillsFirst = scores.match.team2;
                    break;
                case 'map 1, 1st blood':
                    event.contestant1Set1FirstBlood = scores.match.team1;
                    event.contestant2Set1FirstBlood = scores.match.team2;
                    break;
                case 'map 2, 1st blood':
                    event.contestant1Set2FirstBlood = scores.match.team1;
                    event.contestant2Set2FirstBlood = scores.match.team2;
                    break;
                case 'map 1, Kills':
                    event.contestant1Set1Score = scores.match.team1;
                    event.contestant2Set1Score = scores.match.team2;
                    break;
                case 'map 2, Kills':
                    event.contestant1Set2Score = scores.match.team1;
                    event.contestant2Set2Score = scores.match.team2;
                    break;
            }
        } else {
            event.contestant1RegulationScore = scores.match.team1;
            event.contestant2RegulationScore = scores.match.team2;
            event.contestant1FinalScore = scores.match.team1;
            event.contestant2FinalScore = scores.match.team2;
            event.scores = true;
        }
    }
    callback();
}

function insertScores_fieldHockey(event, scores, callback){
    if('match' in scores){

    }
    callback();
}

function insertScores_football(event, scores, callback){

    if('1st quarter' in scores){
        event.contestant1Q1Score = scores['1st quarter'].team1;
        event.contestant1Q2Score = scores['1st quarter'].team2;

        if('1st half' in scores){
            event.contestant1Q1Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
            event.contestant1Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
        }
    }

    if('1st half' in scores){
        event.contestant1Q1Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
        event.contestant1Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
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

    if('match' in scores){

    }
    callback();
}

function insertScores_futsal(event, scores, callback){
    callback();
}

function insertScores_handball(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;

        if('match' in scores){
            event.contestant1H2Score = scores['match'].team1 - scores['1st half'].team1;
            event.contestant2H2Score = scores['match'].team2 - scores['1st half'].team2;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores['match'].team1;
        event.contestant2RegulationScore = scores['match'].team2;

        event.contestant1FinalScore = scores['match'].team1;
        event.contestant2FinalScore = scores['match'].team2;
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
            event.contestant1RegulationScore = scores['1st period'].team1;
            event.contestant2RegulationScore = scores['1st period'].team2;
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
        event.contestant1RegulationScore = scores.game.team1;
        event.contestant2RegulationScore = scores.game.team2;
        event.contestant1FinalScore = scores.game.team1;
        event.contestant2FinalScore = scores.game.team2;
        event.scores = true;
    }
    callback();
}

function insertScores_horseRacing(event, scores, callback){
    callback();
}

function insertScores_lacrosse(event, scores, callback){
    if('1st quarter' in scores){
        event.contestant1Q1Score = scores['1st quarter'].team1;
        event.contestant1Q2Score = scores['1st quarter'].team2;

        if('1st half' in scores){
            event.contestant1Q1Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
            event.contestant1Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
        }
    }

    if('1st half' in scores){
        event.contestant1Q1Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
        event.contestant1Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
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
    callback();
}

function insertScores_otherSports(event, scores, callback){
    callback();
}

function insertScores_politics(event, scores, callback){
    callback();
}

function insertScores_rinkHockey(event, scores, callback){
    callback();
}

function insertScores_rugby(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;

        if('match' in scores){
            event.contestant1H2Score = scores['match'].team1 - scores['1st half'].team1;
            event.contestant2H2Score = scores['match'].team2 - scores['1st half'].team2;

            event.contestant1RegulationScore = scores['match'].team1;
            event.contestant2RegulationScore = scores['match'].team2;

            event.contestant1FinalScore = scores['match'].team1;
            event.contestant2FinalScore = scores['match'].team2;
            event.scores = true;
        }
    }
    callback();
}

function insertScores_snooker(event, scores, callback){
    callback();
}

function insertScores_soccer(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;

        if('match' in scores){
            event.contestant1H2Score = scores['match'].team1 - scores['1st half'].team1;
            event.contestant2H2Score = scores['match'].team2 - scores['1st half'].team2;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores['match'].team1;
        event.contestant2RegulationScore = scores['match'].team2;

        event.contestant1FinalScore = scores['match'].team1;
        event.contestant2FinalScore = scores['match'].team2;
        event.scores = true;
    }
    callback();
}

function insertScores_softball(event, scores, callback){
    if('1st half' in scores){
        event.contestant1H1Score = scores['1st half'].team1;
        event.contestant2H1Score = scores['1st half'].team2;

        if('match' in scores){
            event.contestant1H2Score = scores['match'].team1 - scores['1st half'].team1;
            event.contestant2H2Score = scores['match'].team2 - scores['1st half'].team2;
        }
    }

    if('match' in scores){
        event.contestant1RegulationScore = scores['match'].team1;
        event.contestant2RegulationScore = scores['match'].team2;

        event.contestant1FinalScore = scores['match'].team1;
        event.contestant2FinalScore = scores['match'].team2;
        event.scores = true;
    }
    callback();
}

function insertScores_squash(event, scores, callback){
    callback();
}

function insertScores_tableTennis(event, scores, callback){
    callback();
}

function insertScores_tennis(event, scores, callback){
    callback();
}

function insertScores_volleyball(event, scores, callback){

}

function insertScores_volleyballPoints(event, scores, callback){
    callback();
}

function insertScores_waterPolo(event, scores, callback){
    callback();
}

function insertScores_padelTennis(event, scores, callback){
    callback();
}

function insertScores_aussieRules(event, scores, callback){
    if('1st quarter' in scores){
        event.contestant1Q1Score = scores['1st quarter'].team1;
        event.contestant1Q2Score = scores['1st quarter'].team2;

        if('1st half' in scores){
            event.contestant1Q1Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
            event.contestant1Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
        }
    }

    if('1st half' in scores){
        event.contestant1Q1Score = scores['1st half'].team1 -  scores['1st quarter'].team1;
        event.contestant1Q2Score = scores['1st half'].team2 -  scores['1st quarter'].team2;
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

function insertScores_matchups(event, scores, callback){
    if('matchups' in scores){
        event.contestant1FinalScore = scores.matchups.team1;
        event.contestant2FinalScore = scores.matchups.team2;
        event.contestant1RegulationScore = scores.matchups.team1;
        event.contestant2RegulationScore = scores.matchups.team2;
        event.scores = true;
    }
    callback();
}

function insertScores(event, scores, sportName, leagueName, scoreType, callback){
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
            insertScores_basketball(event, scores, callback);
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
            insertScores_eSports(event, scores, scoreType, callback);
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
            insertScores_hockey(event, scores, scoreType, callback);
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
            insertScores_tennis(event, scores, callback);
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
        case 'Golf':
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
