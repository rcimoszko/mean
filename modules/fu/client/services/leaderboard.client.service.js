'use strict';

angular.module('fu').factory('Leaderboard', ['ApiLeaderboard', 'ApiLeaderboardSports', 'ApiLeaderboardLeagues', 'ApiLeaderboardContestants',
    function(ApiLeaderboard, ApiLeaderboardSports, ApiLeaderboardLeagues, ApiLeaderboardContestants) {

        var getLeaderboard = function(query, callback){
            function cbSuccess(leaderboard){
                callback(null, leaderboard);
            }

            function cbError(response){
                callback(response.data.message);
            }
        };

        var getSports = function(callback){
            function cbSuccess(sports){
                callback(null, sports);
            }

            function cbError(response){
                callback(response.data.message);
            }

        };

        var getLeagues = function(sportId, callback){
            function cbSuccess(leagues){
                callback(null, leagues);
            }

            function cbError(response){
                callback(response.data.message);
            }

        };

        var getContestants = function(leagueId, callback){
            function cbSuccess(contestants){
                callback(null, contestants);
            }

            function cbError(response){
                callback(response.data.message);
            }
        };



        return {
            getLeaderboard: getLeaderboard,
            getSports: getSports,
            getLeagues: getLeagues,
            getContestants: getContestants
        };
    }
]);