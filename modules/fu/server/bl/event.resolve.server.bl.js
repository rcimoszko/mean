'use strict';


function assignWinner(event, callback){

    if(event.overtime){
        if(event.contestant1OTScore === event.contestant2OTScore){
            event.draw = true;
        } else if (event.contestant1OTScore > event.contestant2OTScore) {
            event.contestantWinner = event.contestant1;
        } else if (event.contestant2OTScore > event.contestant1OTScore){
            event.contestantWinner = event.contestant2;
        }
    } else {
        if(event.sport.name === 'Tennis'){
            if(event.contestant1SetsWon > event.contestant2SetsWon){
                event.contestantWinner = event.contestant1;
            } else if (event.contestant2SetsWon > event.contestant1SetsWon){
                event.contestantWinner = event.contestant2;
            }
        } else {
            if(event.contestant1RegulationScore && event.contestant2RegulationScore){
                if (event.contestant1RegulationScore === event.contestant2RegulationScore){
                    event.draw = true;
                } else if(event.contestant1RegulationScore > event.contestant2RegulationScore){
                    event.contestantWinner = event.contestant1;
                } else if (event.contestant2RegulationScore > event.contestant1RegulationScore){
                    event.contestantWinner = event.contestant2;
                }
            }
        }
    }
    callback();
}



function insertScores(event, scores, sportName, leagueName, scoreType, callback){
    /*
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
    */
}

exports.insertScores = insertScores;
exports.assignWinner = assignWinner;