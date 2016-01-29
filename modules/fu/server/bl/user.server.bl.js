'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    PicksBl = require('./pick.server.bl'),
    User = mongoose.model('User');


function getByUsername(username, callback){

    function cb(err, user){
        callback(err, user);
    }

    User.findOne({'name':{ $regex: new RegExp(username, 'i')}}).exec(cb);
}


function getFollowing(user, callback){
    callback(null);
}

function getHub(user, callback){
    callback(null);
}

function getMessages(user, callback){
    callback(null);
}

function getNotifications(user, callback){
    callback(null);
}

function getPendingPicks(user, callback){
    var query = {'user.ref': user._id, result: 'Pending'};
    PicksBl.getPending(query, callback);


}



function getCompletedPicks(user, callback){
    var todo = [];

    function getPicks(callback){
        var query = {'user.ref': user._id, result: {$ne:'Pending'}};
        PicksBl.getCompleted(query, callback);
    }

    function assignScores(picks, callback){
        var processedPicks = [];

        function assignScore(pick, callback){
            pick = pick.toJSON();
            switch(pick.betDuration){
                case 'game':
                case 'game (OT included)':
                case 'match':
                case 'fight':
                case 'matchups':
                case 'race':
                    pick.contestant1Score = pick.event.contestant1FinalScore;
                    pick.contestant2Score = pick.event.contestant2FinalScore;
                    break;
                case '1st half':
                case '1st 5 innings':
                case '1st end':
                    pick.contestant1Score = pick.event.contestant1H1Score;
                    pick.contestant2Score = pick.event.contestant2H1Score;
                    break;
                case '1st game':
                case '1st set':
                case '1st inning':
                case '1st leg':
                case '1st map':
                case '1st frame':
                case '1st set winner':
                    pick.contestant1Score = pick.event.contestant1Set1Score;
                    pick.contestant2Score = pick.event.contestant2Set1Score;
                    break;
                case '1st period':
                    pick.contestant1Score = pick.event.contestant1P1Score;
                    pick.contestant2Score = pick.event.contestant2P1Score;
                    break;
                case '1st quarter':
                    pick.contestant1Score = pick.event.contestant1Q1Score;
                    pick.contestant2Score = pick.event.contestant2Q1Score;
                    break;
                case 'game (regular time)':
                    pick.contestant1Score = pick.event.contestant1RegulationScore;
                    pick.contestant2Score = pick.event.contestant2RegulationScore;
                    break;
                case '2nd game':
                case '2nd set':
                case '2nd inning':
                case '2nd leg':
                    pick.contestant1Score = pick.event.contestant1Set2Score;
                    pick.contestant2Score = pick.event.contestant2Set2Score;
                    break;
                case '2nd quarter':
                    pick.contestant1Score = pick.event.contestant1Q2Score;
                    pick.contestant2Score = pick.event.contestant2Q2Score;
                    break;
                case '2nd period':
                    pick.contestant1Score = pick.event.contestant1P2Score;
                    pick.contestant2Score = pick.event.contestant2P2Score;
                    break;
                case '2nd half':
                case '2nd set winner':
                    pick.contestant1Score = pick.event.contestant1H2Score;
                    pick.contestant2Score = pick.event.contestant2H2Score;
                    break;
                case '3rd game':
                case '3rd set':
                case '3rd leg':
                case '3rd set winner':
                    pick.contestant1Score = pick.event.contestant1Set3Score;
                    pick.contestant2Score = pick.event.contestant2Set3Score;
                    break;
                case '3rd quarter':
                    pick.contestant1Score = pick.event.contestant1Q3Score;
                    pick.contestant2Score = pick.event.contestant2Q3Score;
                    break;
                case '3rd period':
                    pick.contestant1Score = pick.event.contestant1P3Score;
                    pick.contestant2Score = pick.event.contestant2P3Score;
                    break;
                case '4th quarter':
                    pick.contestant1Score = pick.event.contestant1Q4Score;
                    pick.contestant2Score = pick.event.contestant2Q4Score;
                    break;
                case '4th set':
                case '4th leg':
                case '4th game':
                case '4th set winner':
                case '4th period':
                    pick.contestant1Score = pick.event.contestant1Set4Score;
                    pick.contestant2Score = pick.event.contestant2Set4Score;
                    break;
                case '5th set':
                case '5th leg':
                case '5th game':
                case '5th set winner':
                    pick.contestant1Score = pick.event.contestant1Set5Score;
                    pick.contestant2Score = pick.event.contestant2Set5Score;
                    break;

            }
            if(pick.contestant1Score > pick.contestant2Score){
                pick.winner = 1;
            } else if(pick.contestant2Score > pick.contestant1Score){
                pick.winner = 2;
            } else {
                pick.winner = 'draw';
            }

            processedPicks.push(pick);

            callback();
        }
        function cb(err){
            callback(err, processedPicks);
        }

        async.each(picks, assignScore, cb);

    }

    todo.push(getPicks);
    todo.push(assignScores);

    async.waterfall(todo, callback);

}

function getTracker(user, callback){
    callback(null);
}

exports.getByUsername       = getByUsername;
exports.getFollowing        = getFollowing;
exports.getHub              = getHub;
exports.getMessages         = getMessages;
exports.getNotifications    = getNotifications;
exports.getPendingPicks     = getPendingPicks;
exports.getCompletedPicks   = getCompletedPicks;
exports.getTracker          = getTracker;