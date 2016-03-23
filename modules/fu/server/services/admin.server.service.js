'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    ContestantLogo = mongoose.model('ContestantLogo'),
    SportBl = require('../bl/sport.server.bl'),
    UserBl = require('../bl/user.server.bl'),
    LoopBl = require('../bl/loop.server.bl'),
    BetBl = require('../bl/bet.server.bl'),
    ChannelBl = require('../bl/channel.server.bl'),
    PickBl = require('../bl/pick.server.bl'),
    LeagueBl = require('../bl/league.server.bl'),
    CommentBl = require('../bl/comment.server.bl'),
    EmailBl = require('../bl/email.server.bl'),
    HotpickBl = require('../bl/hotpick.server.bl'),
    ContestantBl = require('../bl/contestant.server.bl'),
    FollowBl = require('../bl/follow.server.bl'),
    GroupBl = require('../bl/group.server.bl'),
    slug = require('speakingurl');

function assignSlugs(callback){
    var todo = [];

    function getSports(callback){
        SportBl.getAll(callback);
    }

    function processSports(sports, callback){

        function processSport(sport, callback){

            var todo = [];

            function saveSport(callback){
                sport.slug = slug(sport.name);
                sport.save(callback);
            }

            function getLeagues(sport, num, callback){
                LeagueBl.getBySport(sport, callback);
            }

            function processLeagues(leagues, callback){

                function processLeague(league, callback){

                    var todo = [];

                    function saveLeague(callback){
                        league.slug = slug(league.name);
                        console.log(league.name);
                        league.save(callback);
                    }

                    function getContestants(league, num, callback){
                        ContestantBl.getByLeague(league, callback);
                    }

                    function processContestants(contestants, callback){
                        function processContestant(contestant, callback){
                            contestant.slug = slug(contestant.name);
                            contestant.save(callback);
                        }

                        async.eachSeries(contestants, processContestant, callback);
                    }

                    todo.push(saveLeague);
                    todo.push(getContestants);
                    todo.push(processContestants);

                    async.waterfall(todo, callback);

                }
                async.eachSeries(leagues, processLeague, callback);

            }

            todo.push(saveSport);
            todo.push(getLeagues);
            todo.push(processLeagues);


            async.waterfall(todo, callback);
        }

        async.eachSeries(sports, processSport, callback);

    }

    todo.push(getSports);
    todo.push(processSports);

    async.waterfall(todo, callback);
}

function decoupleBets(callback){

    function processEvent(event, callback){

        function processBet(bet, callback){
            function cb(err, bet){
                event.pinnacleBets.push(bet);
                callback(err);
            }
            console.log(bet._id);
            bet.event = event._id;
            BetBl.create(bet, cb);
        }

        function cb(err){
            event.betsAvailable = undefined;
            event.save(callback);
        }

        async.each(event.betsAvailable, processBet, cb);
    }

    LoopBl.processEventGeneric(processEvent, callback);
}

function updateHockeyBets(callback){
    var todo = [];

    function updateOvertimeBets(callback){
        var query = {otIncluded: true, betDuration: 'game'};
        var update = {betDuration: 'game (OT included)'};
        var options = {multi: true};

        BetBl.updateByQuery(query, update, options, callback);
    }

    function updateRegBets(callback){
        var query = {otIncluded: false, betDuration: 'game'};
        var update = {betDuration: 'game (regular time)'};
        var options = {multi: true};

        BetBl.updateByQuery(query, update, options, callback);
    }

    todo.push(updateOvertimeBets);
    todo.push(updateRegBets);

    function cb(err){
        callback(err);
    }

    async.parallel(todo, cb);

}

function assignBetTypes(callback){
    var todo = [];
    var generalOrder = ['spread', 'moneyline', 'total points', 'team totals'];

    function setBetTypesForSports(callback){
        function processSport(sport, callback){
            var aggArray = [];
            var match = {$match: {sport:mongoose.Types.ObjectId(sport._id)}};
            var group = {$group: {_id: '$sport', betTypes: {$addToSet:'$betType'}}};
            aggArray.push(match);
            aggArray.push(group);

            function cb(err, sportBetTypes){
                if(sportBetTypes.length && sportBetTypes[0].betTypes.length){
                    sport.betTypes = _.sortBy(sportBetTypes[0].betTypes, function(betType){
                        if(generalOrder.indexOf(betType) === -1) return generalOrder.length;
                        return generalOrder.indexOf(betType);
                    });
                }
                sport.save(callback);
            }
            PickBl.aggregate(aggArray, cb);
        }
        LoopBl.processSportGeneric(processSport, callback);
    }

    function setBetTypesForLeagues(callback){
        function processLeague(league, callback){
            var aggArray = [];
            var match = {$match: {league:mongoose.Types.ObjectId(league._id)}};
            var group = {$group: {_id: '$league', betTypes: {$addToSet:'$betType'}}};
            aggArray.push(match);
            aggArray.push(group);

            function cb(err, leagueBetTypes){
                if(leagueBetTypes.length && leagueBetTypes[0].betTypes.length){
                    league.betTypes = _.sortBy(leagueBetTypes[0].betTypes, function(betType){
                        if(generalOrder.indexOf(betType) === -1) return generalOrder.length;
                        return generalOrder.indexOf(betType);
                    });
                }
                console.log(league.betTypes);
                league.save(callback);
            }
            PickBl.aggregate(aggArray, cb);
        }
        LoopBl.processLeagueGeneric(processLeague, callback);

    }

    todo.push(setBetTypesForSports);
    todo.push(setBetTypesForLeagues);

    async.waterfall(todo, callback);
}

function assignBetDurations(callback){

    var todo = [];
    var generalOrder = ['match', 'matchups', 'game', 'game (OT included)', 'game (regular time)', 'fight', 'series', '1st set winner', '1st 5 innings', '1st half', '2nd half', '1st period', '2nd period', '3rd period', '1st quarter', '2nd quarter', '3rd quarter', '4th quarter', 'map 1', 'map 2', 'map 3'];

    function setBetDurationsForSports(callback){
        function processSport(sport, callback){
            var aggArray = [];
            var match = {$match: {sport:mongoose.Types.ObjectId(sport._id)}};
            var group = {$group: {_id: '$sport', betDurations: {$addToSet:'$betDuration'}}};
            aggArray.push(match);
            aggArray.push(group);

            function cb(err, sportBetDurations){
                if(sportBetDurations.length && sportBetDurations[0].betDurations.length){
                    sport.betDurations = _.sortBy(sportBetDurations[0].betDurations, function(betDuration){
                        if(generalOrder.indexOf(betDuration) === -1) return generalOrder.length;
                        return generalOrder.indexOf(betDuration);
                    });
                }
                sport.save(callback);
            }
            PickBl.aggregate(aggArray, cb);
        }
        LoopBl.processSportGeneric(processSport, callback);
    }

    function setBetDurationsForLeagues(callback){
        function processLeague(league, callback){
            var aggArray = [];
            var match = {$match: {league:mongoose.Types.ObjectId(league._id)}};
            var group = {$group: {_id: '$league', betDurations: {$addToSet:'$betDuration'}}};
            aggArray.push(match);
            aggArray.push(group);

            function cb(err, leagueBetDurations){
                if(leagueBetDurations.length && leagueBetDurations[0].betDurations.length){
                    league.betDurations = _.sortBy(leagueBetDurations[0].betDurations, function(betDuration){
                        if(generalOrder.indexOf(betDuration) === -1) return generalOrder.length;
                        return generalOrder.indexOf(betDuration);
                    });
                }
                console.log(league.betDurations);
                league.save(callback);
            }
            PickBl.aggregate(aggArray, cb);
        }
        LoopBl.processLeagueGeneric(processLeague, callback);

    }

    todo.push(setBetDurationsForSports);
    todo.push(setBetDurationsForLeagues);

    async.waterfall(todo, callback);

}

function createChannels(callback){
    var excludeSports = ['Basketball', 'Hockey', 'Football', 'Futsal', 'Horse Racing','Soccer'];
    var leagueChannels = ['NBA', 'NFL', 'NHL', 'NCAAB', 'NCAAF', 'MLB', 'ENG Premier League', 'ESP La Liga', 'FRA Ligue 1', 'GER Bundesliga', 'ITA Serie A', 'NLD Eredivisie', 'UEFA Champions League', 'UEFA Europa League', 'USA MLS'];
    var otherChannels = ['Other Hockey', 'Other Basketball', 'Other Baseball'];
    var todo = [];

    function createSportChannels(callback){
        function processSport(sport, callback){
            if(excludeSports.indexOf(sport.name) !== -1) return callback(null);

            function cb(err, channel){
                if(channel) return callback(err);
                var newChannel = {
                    name: sport.name,
                    type: 'sport',
                    sport: {name: sport.name, ref:sport._id},
                };
                ChannelBl.create(newChannel, callback);
            }

            ChannelBl.getOneByQuery({'sport.name':sport.name}, cb);
        }
        LoopBl.processSportGeneric(processSport, callback);

    }

    function createLeagueChannels(callback){

        function createLeagueChannel(leagueChannel, callback){
            var todo = [];

            function findLeague(callback){
                LeagueBl.getOneByQuery({name: leagueChannel}, callback);
            }

            function createChannel(league, callback){
                if(!league) return callback(null);

                function cb(err, channel){
                    if(channel) return callback(err);
                    var newChannel = {
                        name: leagueChannel,
                        type: 'league',
                        league: {name: league.name, ref:league._id}
                    };
                    ChannelBl.create(newChannel, callback);
                }
                ChannelBl.getOneByQuery({'league.ref':league._id}, cb);
            }

            function cb(err, channel){
                callback(err);
            }


            todo.push(findLeague);
            todo.push(createChannel);

            async.waterfall(todo, cb);

        }

        async.eachSeries(leagueChannels, createLeagueChannel);

    }

    todo.push(createSportChannels);
    todo.push(createLeagueChannels);

    async.waterfall(todo, callback);



}

function assignCommentIds(model, callback){
    var todo = [];
    function getComments(callback){
        CommentBl.getAll(callback);
    }

    function populateComments(comments, callback){
        var populate = {path:'discussion', model: model};
        CommentBl.populateBy(comments, populate, callback);
    }

    function processComments(comments, callback){
        function processComment(comment, callback){
            if(comment.discussion){
                if(model === 'Pick'){
                    comment.pick = comment.discussion._id;
                    comment.event = comment.discussion.event;
                    comment.league = comment.discussion.league;
                    comment.sport = comment.discussion.sport;
                } else if (model === 'Event'){
                    comment.event = comment.discussion._id;
                    comment.league = comment.discussion.league.ref;
                    comment.sport = comment.discussion.sport.ref;
                }
            }


            function cb(err){
                callback();
            }
            comment.save(cb);
        }


        async.eachSeries(comments, processComment, callback);
    }
    todo.push(getComments);
    todo.push(populateComments);
    todo.push(processComments);

    async.waterfall(todo, callback);
}

function assignLogos(callback){
    var todo = [];

    function getConLogos(callback){
        ContestantLogo.find({}, callback);
    }

    function processLogos(conLogos, callback){


        function addLogo(conLogo, callback){
            var todo = [];

            function getContestants(callback){
                ContestantBl.getByQuery({name: conLogo.name}, callback);
            }

            function updateContesants(contestants, callback){
                function updateContestant(contestant, callback){
                    var data = {
                        abbrName: conLogo.abbrName,
                        logoUrl: conLogo.logoUrl
                    };
                    ContestantBl.update(data, contestant, callback);
                }

                async.eachSeries(contestants, updateContestant, callback);
            }

            todo.push(getContestants);
            todo.push(updateContesants);

            async.waterfall(todo, callback);

        }

        async.eachSeries(conLogos, addLogo, callback);
    }

    todo.push(getConLogos);
    todo.push(processLogos);

    async.waterfall(todo, callback);
}

function checkPremium(callback){
    var todo = [];

    function getUsers(callback){
        UserBl.getHotPickUsers(callback);
    }

    function updatePremium_todo(users, callback){

        function updatePremium(user, callback){
            user.checkPremium(callback);
        }

        async.eachSeries(users, updatePremium, callback);

    }

    todo.push(getUsers);
    todo.push(updatePremium_todo);


    async.waterfall(todo, callback);
}

function assignEsportsGroups(callback){
    var todo = [];

    function getEsportsLeagues(callback){
        LeagueBl.getByQuery({'sport.name': 'E Sports'}, callback);
    }

    function processLeagues(leagues, callback){

        function processLeague(league, callback){
            var groupName = LeagueBl.getEsportsGroupName(league.name);
            console.log(league.name);
            console.log(groupName);
            if(!groupName) return callback();

            var query = {name: {$regex: new RegExp('^' + groupName +'$', 'i')}};

            GroupBl.getOneByQuery(query, function(err, group){
                if(err || !group) return callback();

                function cb(err){
                    callback(err);
                }

                league.group = {name: group.name, ref: group._id};
                league.save(cb);
            });
        }

        async.eachSeries(leagues, processLeague, callback);
    }

    todo.push(getEsportsLeagues);
    todo.push(processLeagues);

    async.waterfall(todo, callback);
}

//check if user off trial every 10 min
function checkTrial(callback){

    var todo = [];

    function getTrialUsers(callback){
        var startDate = new Date();
        startDate.setDate(startDate.getDate()-7);
        console.log(startDate);
        var query = {trialStartDate: {$lte:startDate}, trial:true};
        UserBl.getByQuery(query, callback);
    }

    function updateTrialUsers(users, callback){

        function processUser(user, callback){

            var todo = [];

            function sendEmail(callback){
                EmailBl.sendTrialOverEmail(user, 'fansunite.com', function(err){
                    if(err)console.log(err);
                });
                callback();
            }

            function updateUser(callback){
                user.trial = false;
                user.trialEndDate = new Date();
                user.trialUsed = true;

                function cb(err){
                    callback(err);
                }

                user.save(cb);
            }

            todo.push(sendEmail);
            todo.push(updateUser);

            async.waterfall(todo, callback);

        }
        async.eachSeries(users, processUser, callback);
    }


    todo.push(getTrialUsers);
    todo.push(updateTrialUsers);

    async.waterfall(todo, callback);

}

//update hotpick every 10 min
function updateHotPick(callback){
    HotpickBl.updateHotPick(callback);
}

//check every 10 minutes, auto follow a user after 6 hours of account creation
function autoFollow(callback){

    var todo = [];
    var usernames = ['deghdami', 'rcimoszko', 'dmcintyre', 'nshuster'];

    function getNewUsers(callback){
        var startDate = new Date();
        var endDate = new Date();
        startDate.setHours(startDate.getHours() - 6);
        endDate.setHours(endDate.getHours() - 6);
        endDate.setMinutes(endDate.getMinutes() + 10);
        var query = {created:{$lte: endDate, $gt: startDate}};

        UserBl.getByQuery(query, callback);
    }

    function followUsers(users, callback){
        function followUser(user, callback){
            var todo = [];

            function getRandomUser(callback){
                var randomIndex = Math.floor((Math.random() * 4)); // random number between 0-3;
                var username = usernames[randomIndex];
                var query = {username: username};
                UserBl.getOneByQuery(query, callback);
            }

            function followWithUser(randomUser, callback){
                FollowBl.follow(randomUser, user, 'fansunite.com', false, callback);
            }

            todo.push(getRandomUser);
            todo.push(followWithUser);

            async.waterfall(todo, callback);
        }
        async.eachSeries(users, followUser, callback);
    }

    todo.push(getNewUsers);
    todo.push(followUsers);

    async.waterfall(todo, callback);
}

//check every hour minutes, auto follow a user after 6 hours of account creation
function sendBlogPost(callback){
    var todo = [];

    function getNewUsers(callback){
        var startDate = new Date();
        var endDate = new Date();
        startDate.setDate(startDate.getDate() - 2);
        endDate.setDate(endDate.getDate() - 2);
        endDate.setHours(endDate.getHours() + 1);
        var query = {created:{$lte: endDate, $gt: startDate}};
        console.log(query);

        UserBl.getByQuery(query, callback);
    }

    function sendBlogEmails(users, callback){

        function sendBlogEmail(user, callback){
            EmailBl.sendBlogEmail(user, callback);
        }

        async.eachSeries(users, sendBlogEmail, callback);
    }

    todo.push(getNewUsers);
    todo.push(sendBlogEmails);

    async.waterfall(todo, callback);

}



exports.assignSlugs         = assignSlugs;
exports.decoupleBets        = decoupleBets;
exports.updateHockeyBets    = updateHockeyBets;
exports.assignBetTypes        = assignBetTypes;
exports.assignBetDurations    = assignBetDurations;
exports.assignEsportsGroups = assignEsportsGroups;
exports.createChannels    = createChannels;
exports.assignCommentIds    = assignCommentIds;
exports.assignLogos = assignLogos;

exports.checkTrial  = checkTrial;
exports.updateHotPick  = updateHotPick;
exports.checkPremium = checkPremium;
exports.autoFollow = autoFollow;
exports.sendBlogPost = sendBlogPost;