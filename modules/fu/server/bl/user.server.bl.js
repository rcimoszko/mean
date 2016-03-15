'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    cloudinary = require('cloudinary'),
    multiparty = require('multiparty'),
    config = require('../../../../config/config'),
    PickBl = require('./pick.server.bl'),
    PickListBl = require('./pick.list.server.bl'),
    FollowBl = require('./follow.server.bl'),
    SubscriptionBl = require('./subscription.server.bl'),
    LeaderboardBl = require('./leaderboard.server.bl'),
    NotificationBl = require('./notification.server.bl'),
    ConversationBl = require('../../../message/server/bl/conversation.server.bl'),
    User = mongoose.model('User');


function getByUsername(username, callback){

    function cb(err, user){
        callback(err, user);
    }

    User.findOne({'username':{ $regex: new RegExp('^' + username +'$', 'i')}}).exec(cb);
}

function getFollowing(user, query, callback){
    var todo = [];
    var dateId = query.dateId;
    var leagueId = query.leagueId;
    var sportId = query.sportId;
    var followingIdArray = [];
    var followingList = [];

    function getFollowingList_todo(callback){
        function cb(err, list){
            followingList = list;
            callback(err);
        }
        FollowBl.getFollowingList(user._id, cb);
    }

    function getFollowingLeaderboard(callback){
        function cb(err, followingLeaderboard){
            callback(err, followingLeaderboard);
        }

        followingIdArray = _.chain(followingList).pluck('_id').value();
        LeaderboardBl.buildLeaderboard(dateId, sportId, leagueId, 'all', 'both', 'all', 'all', null, followingIdArray, null, cb);
    }

    function mergeFollowingListAndLeaderboard(followingLeaderboard, callback){
        var currentUser;
        function findInLeaderboard(leaderboard){
            return String(leaderboard.user._id) === String(currentUser._id);
        }

        for(var i=0; i<followingList.length; i++){
            currentUser = followingList[i];
            var found = _.find(followingLeaderboard, findInLeaderboard);
            followingList[i] =  followingList[i].toJSON();
            followingList[i].events = [];
            if(found){
                followingList[i].avgOdds = found.avgOdds;
                followingList[i].avgBet = found.avgBet;
                followingList[i].units = found.units;
                followingList[i].profit = found.profit;
                followingList[i].roi = found.roi;
                followingList[i].wins = found.wins;
                followingList[i].losses = found.losses;
                followingList[i].pending = found.pending;
            } else {
                followingList[i].avgOdds = 0;
                followingList[i].avgBet = 0;
                followingList[i].units =  0;
                followingList[i].roi = 0;
                followingList[i].profit = 0;
                followingList[i].wins = 0;
                followingList[i].losses = 0;
                followingList[i].pending = 0;
            }
        }
        callback();
    }

    function getFollowingPicks(callback){
        PickListBl.getUserEventPickList(sportId, leagueId, followingIdArray, user._id, user.premium || user.trial, callback);
    }

    function addPicksToList(userPickList, callback){
        for(var i=0; i < userPickList.length; i++){
            var index = _.findIndex(followingList, {_id: userPickList[i].user.ref});
            if(index) followingList[index].events = userPickList[i].events;
        }
        callback();
    }

    function cb(err){
        callback(err, followingList);
    }

    todo.push(getFollowingList_todo);
    todo.push(getFollowingLeaderboard);
    todo.push(mergeFollowingListAndLeaderboard);
    todo.push(getFollowingPicks);
    todo.push(addPicksToList);

    async.waterfall(todo, cb);

}

function getHub(user, callback){
    callback(null);
}

function getMessages(user, callback){
    callback(null);
}

function getNotifications(userId, callback){
    NotificationBl.getByUser(userId, callback);
}

function getPendingPicks(user, callback){
    var query = {'user.ref': user._id, result: 'Pending'};
    PickBl.getPending(query, callback);
}

function getCompletedPicks(user, callback){
    var todo = [];

    function getPicks(callback){
        var query = {'user.ref': user._id, result: {$ne:'Pending'}};
        PickBl.getCompleted(query, callback);
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
                case '1st frame':
                case '1st set winner':
                    pick.contestant1Score = pick.event.contestant1Set1Score;
                    pick.contestant2Score = pick.event.contestant2Set1Score;
                    break;
                case '1st map':
                case 'map 1':
                    switch(pick.betType.toLowerCase()){
                        case '1st to 10 kills':
                            pick.contestant1Score = pick.event.contestant1Set1KillsFirst;
                            pick.contestant2Score = pick.event.contestant2Set1KillsFirst;
                            break;
                        case '1st blood':
                            pick.contestant1Score = pick.event.contestant1Set1FirstBlood;
                            pick.contestant2Score = pick.event.contestant2Set1FirstBlood;
                            break;
                        case '1st round':
                            pick.contestant1Score = pick.event.contestant1Set1FirstRd;
                            pick.contestant2Score = pick.event.contestant2Set1FirstRd;
                            break;
                        case '1st to 5 rounds':
                            pick.contestant1Score = pick.event.contestant1Set1FirstTo5Rds;
                            pick.contestant2Score = pick.event.contestant2Set1FirstTo5Rds;
                            break;
                        default:
                            pick.contestant1Score = pick.event.contestant1Set1Score;
                            pick.contestant2Score = pick.event.contestant2Set1Score;
                            break;
                    }
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
                case '2nd map':
                case 'map 2':
                    switch(pick.betType.toLowerCase()){
                        case '1st to 10 kills':
                            pick.contestant1Score = pick.event.contestant1Set2KillsFirst;
                            pick.contestant2Score = pick.event.contestant2Set2KillsFirst;
                            break;
                        case '1st blood':
                            pick.contestant1Score = pick.event.contestant1Set2FirstBlood;
                            pick.contestant2Score = pick.event.contestant2Set2FirstBlood;
                            break;
                        case '1st round':
                            pick.contestant1Score = pick.event.contestant1Set2FirstRd;
                            pick.contestant2Score = pick.event.contestant2Set2FirstRd;
                            break;
                        case '1st to 5 rounds':
                            pick.contestant1Score = pick.event.contestant1Set2FirstTo5Rds;
                            pick.contestant2Score = pick.event.contestant2Set2FirstTo5Rds;
                            break;
                        default:
                            pick.contestant1Score = pick.event.contestant1Set2Score;
                            pick.contestant2Score = pick.event.contestant2Set2Score;
                            break;
                    }
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
                case '3rd map':
                case 'map 3':
                    switch(pick.betType.toLowerCase()){
                        case '1st to 10 kills':
                            pick.contestant1Score = pick.event.contestant1Set3KillsFirst;
                            pick.contestant2Score = pick.event.contestant2Set3KillsFirst;
                            break;
                        case '1st blood':
                            pick.contestant1Score = pick.event.contestant1Set3FirstBlood;
                            pick.contestant2Score = pick.event.contestant2Set3FirstBlood;
                            break;
                        case '1st round':
                            pick.contestant1Score = pick.event.contestant1Set3FirstRd;
                            pick.contestant2Score = pick.event.contestant2Set3FirstRd;
                            break;
                        case '1st to 5 rounds':
                            pick.contestant1Score = pick.event.contestant1Set3FirstTo5Rds;
                            pick.contestant2Score = pick.event.contestant2Set3FirstTo5Rds;
                            break;
                        default:
                            pick.contestant1Score = pick.event.contestant1Set3Score;
                            pick.contestant2Score = pick.event.contestant2Set3Score;
                            break;
                    }
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
            if(typeof pick.contestant1Score !== 'undefined' && typeof pick.contestant1Score !== 'undefined'){
                if(pick.contestant1Score > pick.contestant2Score){
                    pick.winner = 1;
                } else if(pick.contestant2Score > pick.contestant1Score){
                    pick.winner = 2;
                } else {
                    pick.winner = 'draw';
                }
            } else if (pick.event.contestantWinner){
                if(String(pick.event.contestantWinner.ref) === String(pick.event.contestant1.ref)){
                    pick.winner = 1;
                    pick.contestant1Score = 1;
                    pick.contestant2Score = 0;

                } else if(String(pick.event.contestantWinner.ref) === String(pick.event.contestant2.ref)){
                    pick.winner = 2;
                    pick.contestant1Score = 0;
                    pick.contestant2Score = 1;

                }
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

function getSubscriptions(user, callback){
    callback(null);
}

function getNewMessageCount(userId, callback){
    ConversationBl.getNewMessageCount(userId, callback);
}

function getUserStatus(user, callback){
    var status = 'free';

    if(user.lifetimePremium){
        if(user.base){
            status = 'lifetime premium with base';
        } else {
            status = 'lifetime premium';
        }
    }
    else if(user.premium){
        switch (user.subscriptionPlan){
            case '1 Month Premium':
            case '6 Months Premium':
                status = 'premium';
                break;
            case '1year':
            case '6month':
            case 'Pro':
                status = 'old premium';
                break;
        }

    }
    else if(user.base){
        status = 'base';
    } else if(user.trial){
        status = 'trial';
    }
    callback(null, status);
}

function getInfo(user, callback){

    function getPendingPicks_todo(callback){
        getPendingPicks(user, callback);
    }

    function getFollowing_todo(callback){
        FollowBl.getFollowingList(user._id, callback);
    }

    function getUserStats(callback){
        //profit, active picks count, units wagered count
        callback(null);
    }

    function getSubscriptions_todo(callback){
        function cb(err, subscriptions){
            var channels = _.map(subscriptions, 'channel.ref');
            callback(err, channels);
        }

        SubscriptionBl.getByUser(user, cb);
    }

    function getNotifications_todo(callback){
        getNotifications(user._id, callback);
    }

    function getNewMessageCount_todo(callback){
        getNewMessageCount(user._id, callback);
    }

    function getUserStatus_todo(callback){
        getUserStatus(user, callback);
    }

    var todo = {
        pendingPicks: getPendingPicks_todo,
        stats: getUserStats,
        following: getFollowing_todo,
        notifications: getNotifications_todo,
        channels: getSubscriptions_todo,
        messageCount: getNewMessageCount_todo,
        status: getUserStatus_todo
    };

    async.parallel(todo, callback);
}

function getForSearch(query, callback){
    User.find(query).sort('username').select('username').limit(5).exec(callback);
}

function uploadProfilePicture(req, callback){
    var form = new multiparty.Form();
    var user = req.user;

    function cb(err, fields, files){

        var todo = [];

        cloudinary.config(config.cloudinary);

        function uploadFile(callback){
            function cb(result) {
                callback(err, result);
            }

            cloudinary.uploader.upload(files.file[0].path, cb, {public_id: user.username.toLowerCase(), secure: true, overwrite:true, width:128, height:128, crop:'fill'});
        }

        function updateUser(result, callback){
            user.updated = Date.now();
            user.profileUrl = result.secure_url;
            user.avatarUrl = cloudinary.url(user.username.toLowerCase()+'.'+result.format, { width: 50, secure:true, height: 50, crop: 'fill', version: result.version });
            user.save(callback);
        }
        todo.push(uploadFile);
        todo.push(updateUser);

        async.waterfall(todo, callback);

    }

    form.parse(req, cb);

}


function updateStreak(userId, callback){
    var todo = [];

    function getUserPicks(callback){
        var query = {'user.ref':userId, result: { $ne: 'Pending' }};
        var options =  {sort: {eventStartTime: -1, timeResolved: 1}, limit: 5};
        PickBl.getByQueryWithOptions(query, options, callback);
    }

    function calculateStreak(picks, callback){
        if(!picks.length) return callback(null, 0, 0);
        var currentStreakType;
        var winStreak;
        var loseStreak;
        for(var i=0; i<picks.length; i++){
            if(i === 0){
                if(picks[i].result.toLowerCase().indexOf('win') !== -1){
                    winStreak = 1;
                    loseStreak = 0;
                    currentStreakType = 'win';
                } else if (picks[i].result.toLowerCase().indexOf('loss') !== -1){
                    loseStreak = 1;
                    winStreak = 0;
                    currentStreakType = 'lose';
                } else if (picks[i].result.toLowerCase().indexOf('push') !== -1){
                    loseStreak = 0;
                    winStreak = 0;
                } else {
                    for(var j=0; j<picks.length; j++){
                        if(picks[j].result.toLowerCase().indexOf('win') !== -1){
                            winStreak = 1;
                            loseStreak = 0;
                            currentStreakType = 'win';
                            i = j;
                            break;
                        } else if (picks[j].result.toLowerCase().indexOf('loss') !== -1){
                            loseStreak = 1;
                            winStreak = 0;
                            currentStreakType = 'lose';
                            i = j;
                            break;
                        }
                    }
                }
            } else {
                if(currentStreakType === 'win'){
                    if(picks[i].result.toLowerCase().indexOf('win') !== -1){
                        winStreak++;
                    } else {
                        break;
                    }
                } else if (currentStreakType === 'lose'){
                    if(picks[i].result.toLowerCase().indexOf('loss') !== -1){
                        loseStreak++;
                    } else {
                        break;
                    }
                }

            }
        }
        callback(null, winStreak, loseStreak);
    }

    function updateUser(winStreak, loseStreak, callback){
        function cb(err){
            callback(err);
        }

        User.update({_id:userId}, {winStreak:winStreak, loseStreak:loseStreak}, cb);
    }

    todo.push(getUserPicks);
    todo.push(calculateStreak);
    todo.push(updateUser);

    async.waterfall(todo, callback);
}

function getByQuery(query, callback){
    User.find(query, callback);
}

function getHotPickUsers(callback){
    var query = {$and:[
                    {$or:[{trial:true}, {base:true}, {premium:true, lifetimePremium:false}]},
                    {$or:[{hotPickEmail:true}, {hotPickEmail:{$exists:false}}]}
                    ]
                };
    User.find(query, callback);
}

exports.getByUsername       = getByUsername;
exports.getByQuery          = getByQuery;
exports.getFollowing        = getFollowing;
exports.getHub              = getHub;
exports.getMessages         = getMessages;
exports.getNotifications    = getNotifications;
exports.getPendingPicks     = getPendingPicks;
exports.getCompletedPicks   = getCompletedPicks;
exports.getTracker          = getTracker;
exports.getInfo             = getInfo;
exports.getUserStatus       = getUserStatus;
exports.getForSearch        = getForSearch;
exports.uploadProfilePicture    = uploadProfilePicture;
exports.getNewMessageCount      = getNewMessageCount;
exports.updateStreak         = updateStreak;
exports.getHotPickUsers      = getHotPickUsers;