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
            if(event.contestant1SetsWon &&  event.contestant2SetsWon){
                if(event.contestant1SetsWon > event.contestant2SetsWon){
                    event.contestantWinner = event.contestant1;
                } else if (event.contestant2SetsWon > event.contestant1SetsWon){
                    event.contestantWinner = event.contestant2;
                }
            } else {
                if(event.contestant1RegulationScore > event.contestant2RegulationScore){
                    event.contestantWinner = event.contestant1;
                } else if (event.contestant2RegulationScore > event.contestant1RegulationScore){
                    event.contestantWinner = event.contestant2;
                }
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

function insertScores_aussieRules(event, scores, callback){
    if(scores.contestant1H1Score && scores.contestant2H1Score){
        event.contestant1H1Score = scores.contestant1H1Score;
        event.contestant2H1Score = scores.contestant2H1Score;
        if(scores.contestant1H2Score &&  scores.contestant2H2Score){
            event.contestant1H2Score = scores.contestant1H2Score;
            event.contestant2H2Score = scores.contestant2H2Score;
            event.contestant1RegulationScore = scores.contestant1H1Score +  scores.contestant1H2Score;
            event.contestant2RegulationScore = scores.contestant2H1Score +  scores.contestant2H2Score;
            if(scores.overtime){
                event.overtime = true;
                event.contestant1OTScore = scores.contestant1OTScore;
                event.contestant2OTScore = scores.contestant2OTScore;
                event.contestant1FinalScore = event.contestant1RegulationScore + event.contestant1OTScore;
                event.contestant2FinalScore = event.contestant2RegulationScore + event.contestant2OTScore;
            } else {
                event.contestant1FinalScore = event.contestant1RegulationScore;
                event.contestant2FinalScore = event.contestant2RegulationScore;
            }
        }
    }
    if(scores.contestant1FinalScore && scores.contestant2FinalScore){
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
        event.contestant1RegulationScore = event.contestant1FinalScore;
        event.contestant2RegulationScore = event.contestant2FinalScore;
    }
    callback();

}

function insertScores_baseball(event, scores, callback){
    if(scores.contestant1H1Score && scores.contestant2H1Score){
        event.contestant1H1Score = scores.contestant1H1Score;
        event.contestant2H1Score = scores.contestant2H1Score;
        if(scores.contestant1H2Score &&  scores.contestant2H2Score){
            event.contestant1H2Score = scores.contestant1H2Score;
            event.contestant2H2Score = scores.contestant2H2Score;
            event.contestant1RegulationScore = scores.contestant1H1Score +  scores.contestant1H2Score;
            event.contestant2RegulationScore = scores.contestant2H1Score +  scores.contestant2H2Score;
            if(scores.overtime){
                event.overtime = true;
                event.contestant1OTScore = scores.contestant1OTScore;
                event.contestant2OTScore = scores.contestant2OTScore;
                event.contestant1FinalScore = event.contestant1RegulationScore + event.contestant1OTScore;
                event.contestant2FinalScore = event.contestant2RegulationScore + event.contestant2OTScore;
            } else {
                event.contestant1FinalScore = event.contestant1RegulationScore;
                event.contestant2FinalScore = event.contestant2RegulationScore;
            }
        }
    }
    if(scores.contestant1FinalScore && scores.contestant2FinalScore){
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
        if(!event.overtime){
            event.contestant1RegulationScore = event.contestant1FinalScore;
            event.contestant2RegulationScore = event.contestant2FinalScore;
        }
    }
    callback();
}

function insertScores_basketball(event, scores, callback){
    if(scores.contestant1Q1Score && scores.contestant2Q1Score){
        event.contestant1Q1Score = scores.contestant1Q1Score;
        event.contestant1Q2Score = scores.contestant2Q1Score;

        if(scores.contestant1Q2Score && scores.contestant2Q2Score){
            event.contestant1Q2Score = scores.contestant1Q2Score;
            event.contestant2Q2Score = scores.contestant2Q2Score;
            event.contestant1H1Score = scores.contestant1Q1Score + scores.contestant1Q2Score;
            event.contestant2H1Score = scores.contestant2Q1Score + scores.contestant2Q2Score;

            if(scores.contestant1Q3Score && scores.contestant2Q3Score){
                event.contestant1Q3Score = scores.contestant1Q3Score;
                event.contestant2Q3Score = scores.contestant2Q3Score;

                if(scores.contestant1Q4Score && scores.contestant2Q4Score){

                    event.contestant1Q4Score = scores.contestant1Q4Score;
                    event.contestant2Q4Score = scores.contestant2Q4Score;

                    event.contestant1RegulationScore =  event.contestant1H1Score +  scores.contestant1Q3Score + scores.contestant1Q4Score;
                    event.contestant2RegulationScore =  event.contestant2H1Score +  scores.contestant2Q3Score + scores.contestant2Q4Score;

                    if(scores.overtime){
                        event.overtime = true;
                        event.contestant1OTScore =  scores.contestant1OTScore;
                        event.contestant2OTScore =  scores.contestant2OTScore;
                        event.contestant1FinalScore = event.contestant1RegulationScore + scores.contestant1OTScore;
                        event.contestant2FinalScore = event.contestant2RegulationScore + scores.contestant2OTScore;
                    } else {
                        event.contestant1FinalScore = event.contestant1RegulationScore;
                        event.contestant2FinalScore = event.contestant2RegulationScore;
                    }

                }
            }
        }
    }
    if(scores.contestant1H1Score && scores.contestant2H1Score){
        event.contestant1H1Score = scores.contestant1H1Score;
        event.contestant2H1Score = scores.contestant2H1Score;
        if(scores.contestant1H2Score && scores.contestant1H2Score){
            event.contestant1H2Score = scores.contestant1H2Score;
            event.contestant2H2Score = scores.contestant2H2Score;
            event.contestant1RegulationScore = scores.contestant1H1Score + scores.contestant1H2Score;
            event.contestant2RegulationScore = scores.contestant2H1Score + scores.contestant2H2Score;

            if(scores.overtime){
                event.overtime = true;
                event.contestant1OTScore = scores.contestant1OTScore;
                event.contestant2OTScore = scores.contestant2OTScore;
                event.contestant1FinalScore = event.contestant1RegulationScore + scores.contestant1OTScore;
                event.contestant2FinalScore = event.contestant2RegulationScore + scores.contestant2OTScore;
            } else {
                event.contestant1FinalScore = event.contestant1RegulationScore;
                event.contestant2FinalScore = event.contestant2RegulationScore;
            }
        }
    }

    if(scores.contestant1FinalScore && scores.contestant1FinalScore){
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
        if(!event.overtime){
            event.contestant1RegulationScore = event.contestant1FinalScore;
            event.contestant2RegulationScore = event.contestant2FinalScore;
        }
    }
    callback();

}

function insertScores_cricket(event, scores, callback){
    if(scores.contestantWinner) event.contestantWinner = scores.contestantWinner;
    if(scores.draw) event.draw = true;
    callback();
}

function insertScores_darts(event, scores, callback){
    if(scores.contestantWinner) event.contestantWinner = scores.contestantWinner;
    if(scores.draw) event.draw = true;
    callback();
}

function insertScores_eSports(event, scores, callback){
    var contestant1SetsWon = 0;
    var contestant2SetsWon = 0;
    var contestant1FinalScore = 0;
    var contestant2FinalScore = 0;

    for(var i=1; i<=5; i++){
        if(scores['contestant1Set'+i+'Score'] && scores['contestant2Set'+i+'Score']){
            event['contestant1Set'+i+'Score'] = scores['contestant1Set'+i+'Score'];
            event['contestant2Set'+i+'Score'] = scores['contestant2Set'+i+'Score'];
            if(scores['contestant1Set'+i+'Score'] > scores['contestant2Set'+i+'Score']){
                contestant1SetsWon++;
            } else if(scores['contestant2Set'+i+'Score'] > scores['contestant1Set'+i+'Score']){
                contestant2SetsWon++;
            }
            contestant1FinalScore = contestant1FinalScore + scores['contestant1Set'+i+'Score'];
            contestant2FinalScore = contestant2FinalScore + scores['contestant2Set'+i+'Score'];
        }
    }

    if(contestant1FinalScore !== 0 && contestant2FinalScore !==0){
        event.contestant1FinalScore = contestant1FinalScore;
        event.contestant2FinalScore = contestant2FinalScore;
        event.contestant1RegulationScore = contestant1FinalScore;
        event.contestant2RegulationScore = contestant2FinalScore;
    }

    if(scores.contestant1FinalScore && scores.contestant2FinalScore){
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
        event.contestant1RegulationScore = scores.contestant1FinalScore;
        event.contestant2RegulationScore = scores.contestant2FinalScore;
    }
    if(contestant1SetsWon !== 0 && contestant2SetsWon !== 0){
        event.contestant1SetsWon = contestant1SetsWon;
        event.contestant2SetsWon = contestant2SetsWon;
    }

    callback();

}

function insertScores_football(event, scores, callback){
    if(scores.contestant1Q1Score && scores.contestant2Q1Score){
        event.contestant1Q1Score = scores.contestant1Q1Score;
        event.contestant1Q2Score = scores.contestant2Q1Score;

        if(scores.contestant1Q2Score && scores.contestant2Q2Score){
            event.contestant1Q2Score = scores.contestant1Q2Score;
            event.contestant2Q2Score = scores.contestant2Q2Score;
            event.contestant1H1Score = scores.contestant1Q1Score + scores.contestant1Q2Score;
            event.contestant2H1Score = scores.contestant2Q1Score + scores.contestant2Q2Score;

            if(scores.contestant1Q3Score && scores.contestant2Q3Score){
                event.contestant1Q3Score = scores.contestant1Q3Score;
                event.contestant2Q3Score = scores.contestant2Q3Score;

                if(scores.contestant1Q4Score && scores.contestant2Q4Score){

                    event.contestant1Q4Score = scores.contestant1Q4Score;
                    event.contestant2Q4Score = scores.contestant2Q4Score;

                    event.contestant1RegulationScore =  event.contestant1H1Score +  scores.contestant1Q3Score + scores.contestant1Q4Score;
                    event.contestant2RegulationScore =  event.contestant2H1Score +  scores.contestant2Q3Score + scores.contestant2Q4Score;

                    if(scores.overtime){
                        event.overtime = true;
                        event.contestant1OTScore =  scores.contestant1OTScore;
                        event.contestant2OTScore =  scores.contestant2OTScore;
                        event.contestant1FinalScore = event.contestant1RegulationScore + scores.contestant1OTScore;
                        event.contestant2FinalScore = event.contestant2RegulationScore + scores.contestant2OTScore;
                    } else {
                        event.contestant1FinalScore = event.contestant1RegulationScore;
                        event.contestant2FinalScore = event.contestant2RegulationScore;
                    }

                }
            }
        }
    }
    if(scores.contestant1H1Score && scores.contestant2H1Score){
        event.contestant1H1Score = scores.contestant1H1Score;
        event.contestant2H1Score = scores.contestant2H1Score;
        if(scores.contestant1H2Score && scores.contestant1H2Score){
            event.contestant1H2Score = scores.contestant1H2Score;
            event.contestant2H2Score = scores.contestant2H2Score;
            event.contestant1RegulationScore = scores.contestant1H1Score + scores.contestant1H2Score;
            event.contestant2RegulationScore = scores.contestant2H1Score + scores.contestant2H2Score;

            if(scores.overtime){
                event.overtime = true;
                event.contestant1OTScore = scores.contestant1OTScore;
                event.contestant2OTScore = scores.contestant2OTScore;
                event.contestant1FinalScore = event.contestant1RegulationScore + scores.contestant1OTScore;
                event.contestant2FinalScore = event.contestant2RegulationScore + scores.contestant2OTScore;
            } else {
                event.contestant1FinalScore = event.contestant1RegulationScore;
                event.contestant2FinalScore = event.contestant2RegulationScore;
            }
        }
    }

    if(scores.contestant1FinalScore && scores.contestant1FinalScore){
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
        if(!event.overtime){
            event.contestant1RegulationScore = event.contestant1FinalScore;
            event.contestant2RegulationScore = event.contestant2FinalScore;
        }
    }
    callback();
}

function insertScores_handball(event, scores, callback){
    if(scores.contestant1H1Score && scores.contestant2H1Score){
        event.contestant1H1Score = scores.contestant1H1Score;
        event.contestant2H1Score = scores.contestant2H1Score;
        if(scores.contestant1H2Score &&  scores.contestant2H2Score){
            event.contestant1H2Score = scores.contestant1H2Score;
            event.contestant2H2Score = scores.contestant2H2Score;
            event.contestant1RegulationScore = scores.contestant1H1Score +  scores.contestant1H2Score;
            event.contestant2RegulationScore = scores.contestant2H1Score +  scores.contestant2H2Score;
            if(scores.overtime){
                event.overtime = true;
                event.contestant1OTScore = scores.contestant1OTScore;
                event.contestant2OTScore = scores.contestant2OTScore;
                event.contestant1FinalScore = event.contestant1RegulationScore + event.contestant1OTScore;
                event.contestant2FinalScore = event.contestant2RegulationScore + event.contestant2OTScore;
            } else {
                event.contestant1FinalScore = event.contestant1RegulationScore;
                event.contestant2FinalScore = event.contestant2RegulationScore;
            }
        }
    }
    if(scores.contestant1FinalScore && scores.contestant2FinalScore){
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
        if(!event.overtime){
            event.contestant1RegulationScore = event.contestant1FinalScore;
            event.contestant2RegulationScore = event.contestant2FinalScore;
        }
    }
    callback();
}

function insertScores_hockey(event, scores, callback){
    if(scores.contestant1P1Score && scores.contestant2P1Score){
        event.contestant1P1Score = scores.contestant1P1Score;
        event.contestant2P1Score = scores.contestant2P1Score;

        if(scores.contestant1P2Score && scores.contestant2P2Score){
            event.contestant1P2Score = scores.contestant1P2Score;
            event.contestant2P2Score = scores.contestant2P2Score;

            if(scores.contestant1P3Score && scores.contestant2P3Score){
                event.contestant1P3Score = scores.contestant1P3Score;
                event.contestant2P3Score = scores.contestant2P3Score;
                event.contestant1RegulationScore = scores.contestant1P1Score + scores.contestant1P2Score + scores.contestant1P3Score;
                event.contestant2RegulationScore = scores.contestant2P1Score + scores.contestant2P2Score + scores.contestant2P3Score;

                if(scores.overtime){
                    event.overtime = true;
                    event.contestant1OTScore = scores.contestant1OTScore;
                    event.contestant2OTScore = scores.contestant2OTScore;
                    event.contestant1FinalScore = event.contestant1RegulationScore + event.contestant1OTScore;
                    event.contestant2FinalScore = event.contestant2RegulationScore + event.contestant2OTScore;
                } else {
                    event.contestant1FinalScore = event.contestant1RegulationScore;
                    event.contestant2FinalScore = event.contestant2RegulationScore;
                }
            }
        }
    }

    if(scores.contestant1FinalScore && scores.contestant2FinalScore){
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
        if(!event.overtime){
            event.contestant1RegulationScore = event.contestant1FinalScore;
            event.contestant2RegulationScore = event.contestant2FinalScore;
        }
    }
    callback();
}

function insertScores_mma(event, scores, callback){
    if(scores.contestantWinner) event.contestantWinner = scores.contestantWinner;
    if(scores.draw) event.draw = scores.draw;
    if(scores.noContest) event.noContest = scores.noContest;
    if(scores.round) event.round = scores.round;
    if(scores.time.minutes) event.time.minutes = scores.time.minutes;
    if(scores.time.seconds) event.time.seconds = scores.time.seconds;
    callback();
}

function insertScores_rugby(event, scores, callback){
    if(scores.contestant1H1Score && scores.contestant2H1Score){
        event.contestant1H1Score = scores.contestant1H1Score;
        event.contestant2H1Score = scores.contestant2H1Score;
        if(scores.contestant1H2Score &&  scores.contestant2H2Score){
            event.contestant1H2Score = scores.contestant1H2Score;
            event.contestant2H2Score = scores.contestant2H2Score;
            event.contestant1RegulationScore = scores.contestant1H1Score +  scores.contestant1H2Score;
            event.contestant2RegulationScore = scores.contestant2H1Score +  scores.contestant2H2Score;
            if(scores.overtime){
                event.overtime = true;
                event.contestant1OTScore = scores.contestant1OTScore;
                event.contestant2OTScore = scores.contestant2OTScore;
                event.contestant1FinalScore = event.contestant1RegulationScore + event.contestant1OTScore;
                event.contestant2FinalScore = event.contestant2RegulationScore + event.contestant2OTScore;
            } else {
                event.contestant1FinalScore = event.contestant1RegulationScore;
                event.contestant2FinalScore = event.contestant2RegulationScore;
            }
        }
    }
    if(scores.contestant1FinalScore && scores.contestant2FinalScore){
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
        if(!event.overtime){
            event.contestant1RegulationScore = event.contestant1FinalScore;
            event.contestant2RegulationScore = event.contestant2FinalScore;
        }
    }
    callback();
}

function insertScores_snooker(event, scores, callback){
    if(scores.contestantWinner) event.contestantWinner = scores.contestantWinner;
    if(scores.draw) event.draw = true;
    callback();
}

function insertScores_soccer(event, scores, callback){
    if(scores.contestant1H1Score && scores.contestant2H1Score){
        event.contestant1H1Score = scores.contestant1H1Score;
        event.contestant2H1Score = scores.contestant2H1Score;
        if(scores.contestant1H2Score &&  scores.contestant2H2Score){
            event.contestant1H2Score = scores.contestant1H2Score;
            event.contestant2H2Score = scores.contestant2H2Score;
            event.contestant1RegulationScore = scores.contestant1H1Score +  scores.contestant1H2Score;
            event.contestant2RegulationScore = scores.contestant2H1Score +  scores.contestant2H2Score;
            if(scores.overtime){
                event.overtime = true;
                event.contestant1OTScore = scores.contestant1OTScore;
                event.contestant2OTScore = scores.contestant2OTScore;
                event.contestant1FinalScore = event.contestant1RegulationScore + event.contestant1OTScore;
                event.contestant2FinalScore = event.contestant2RegulationScore + event.contestant2OTScore;
            } else {
                event.contestant1FinalScore = event.contestant1RegulationScore;
                event.contestant2FinalScore = event.contestant2RegulationScore;
            }
        }
    }
    if(scores.contestant1FinalScore && scores.contestant2FinalScore){
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
        if(!event.overtime){
            event.contestant1RegulationScore = event.contestant1FinalScore;
            event.contestant2RegulationScore = event.contestant2FinalScore;
        }
    }
    callback();
}

function insertScores_tableTennis(event, scores, callback){
    if(scores.contestant1FinalScore && scores.contestant2FinalScore) {
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
    }
    if(scores.contestantWinner) event.contestantWinner = scores.contestantWinner;
}

function insertScores_tennis(event, scores, callback){
    var contestant1SetsWon = 0;
    var contestant2SetsWon = 0;
    var contestant1FinalScore = 0;
    var contestant2FinalScore = 0;

    for(var i=1; i<=5; i++){
        if(scores['contestant1Set'+i+'Score'] && scores['contestant2Set'+i+'Score']){
            event['contestant1Set'+i+'Score'] = scores['contestant1Set'+i+'Score'];
            event['contestant2Set'+i+'Score'] = scores['contestant2Set'+i+'Score'];
            if(scores['contestant1Set'+i+'Score'] > scores['contestant2Set'+i+'Score']){
                contestant1SetsWon++;
            } else if(scores['contestant2Set'+i+'Score'] > scores['contestant1Set'+i+'Score']){
                contestant2SetsWon++;
            }
            contestant1FinalScore = contestant1FinalScore + scores['contestant1Set'+i+'Score'];
            contestant2FinalScore = contestant2FinalScore + scores['contestant2Set'+i+'Score'];
        }
    }

    if(contestant1FinalScore !== 0 && contestant2FinalScore !==0){
        event.contestant1FinalScore = contestant1FinalScore;
        event.contestant2FinalScore = contestant2FinalScore;
        event.contestant1RegulationScore = contestant1FinalScore;
        event.contestant2RegulationScore = contestant2FinalScore;
    }

    if(scores.contestant1FinalScore && scores.contestant2FinalScore){
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
        event.contestant1RegulationScore = scores.contestant1FinalScore;
        event.contestant2RegulationScore = scores.contestant2FinalScore;
    }
    if(contestant1SetsWon !== 0 && contestant2SetsWon !== 0){
        event.contestant1SetsWon = contestant1SetsWon;
        event.contestant2SetsWon = contestant2SetsWon;
    }

    callback();

}

function insertScores_volleyball(event, scores, callback){
    if(scores.contestant1H1Score && scores.contestant2H1Score){
        event.contestant1H1Score = scores.contestant1H1Score;
        event.contestant2H1Score = scores.contestant2H1Score;
        if(scores.contestant1H2Score &&  scores.contestant2H2Score){
            event.contestant1H2Score = scores.contestant1H2Score;
            event.contestant2H2Score = scores.contestant2H2Score;
            event.contestant1RegulationScore = scores.contestant1H1Score +  scores.contestant1H2Score;
            event.contestant2RegulationScore = scores.contestant2H1Score +  scores.contestant2H2Score;
            if(scores.overtime){
                event.overtime = true;
                event.contestant1OTScore = scores.contestant1OTScore;
                event.contestant2OTScore = scores.contestant2OTScore;
                event.contestant1FinalScore = event.contestant1RegulationScore + event.contestant1OTScore;
                event.contestant2FinalScore = event.contestant2RegulationScore + event.contestant2OTScore;
            } else {
                event.contestant1FinalScore = event.contestant1RegulationScore;
                event.contestant2FinalScore = event.contestant2RegulationScore;
            }
        }
    }
    if(scores.contestant1FinalScore && scores.contestant2FinalScore){
        event.contestant1FinalScore = scores.contestant1FinalScore;
        event.contestant2FinalScore = scores.contestant2FinalScore;
        if(!event.overtime){
            event.contestant1RegulationScore = event.contestant1FinalScore;
            event.contestant2RegulationScore = event.contestant2FinalScore;
        }
    }
    callback();
}

function insertScores_matchups(event, scores, callback){
    if(scores.contestantWinner) event.contestantWinner = scores.contestantWinner;
}


function insertScores(event, scores, callback){

    switch(event.sport.name){
        case 'Aussie Rules Football':
        case 'Aussie Rules':
             insertScores_aussieRules(event, scores, callback);
             break;
        case 'Baseball':
            insertScores_baseball(event, scores, callback);
            break;
        case 'Basketball':
            insertScores_basketball(event, scores, callback);
            break;
        case 'Cricket':
            insertScores_cricket(event, scores, callback);
            break;
        case 'Darts':
            insertScores_darts(event, scores, callback);
            break;
        case 'E Sports':
            insertScores_eSports(event, scores, callback);
            break;
        case 'Football':
            insertScores_football(event, scores, callback);
            break;
        case 'Handball':
            insertScores_handball(event, scores, callback);
            break;
        case 'Hockey':
            insertScores_hockey(event, scores, callback);
            break;
        case 'Mixed Martial Arts':
            insertScores_mma(event, scores, callback);
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
        case 'Table Tennis':
            insertScores_tableTennis(event, scores, callback);
            break;
        case 'Tennis':
            insertScores_tennis(event, scores, callback);
            break;
        case 'Volleyball':
            insertScores_volleyball(event, scores, callback);
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
exports.assignWinner = assignWinner;