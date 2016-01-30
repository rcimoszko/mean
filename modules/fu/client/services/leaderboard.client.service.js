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
            ApiLeaderboard.query(query, cbSuccess, cbError);
        };

        var getSports = function(callback){
            function cbSuccess(sports){
                callback(null, sports);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeaderboardSports.query(cbSuccess, cbError);
        };

        var getLeagues = function(sportId, callback){
            function cbSuccess(leagues){
                callback(null, leagues);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeaderboardLeagues.query({sportId: sportId}, cbSuccess, cbError);
        };

        var getContestants = function(leagueId, callback){
            function cbSuccess(contestants){
                callback(null, contestants);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeaderboardContestants.query({leagueId: leagueId}, cbSuccess, cbError);
        };



        return {
            getLeaderboard: getLeaderboard,
            getSports: getSports,
            getLeagues: getLeagues,
            getContestants: getContestants
        };
    }
]);