'use strict';

angular.module('fu').factory('User', ['Authentication', 'ApiUserPicksPending', 'ApiUserPicksCompleted', 'ApiUserFollowing',
    function(Authentication, ApiUserPicksPending, ApiUserPicksCompleted, ApiUserFollowing) {

        var getPendingPicks = function(callback){
            function cbSuccess(picks){
                picks.pending = picks;
                callback(null, picks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserPicksPending.query({}, cbSuccess, cbError);
        };

        var getCompletedPicks = function(page, callback){
            function cbSuccess(picks){
                callback(null, picks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserPicksCompleted.query({page:page}, cbSuccess, cbError);
        };

        var getFollowing = function(query, callback){
            function cbSuccess(following){
                callback(null, following);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserFollowing.query(query, cbSuccess, cbError);

        };


        var picks = {pending:[]};

        return {
            picks: picks,
            getPendingPicks: getPendingPicks,
            getCompletedPicks: getCompletedPicks,
            getFollowing: getFollowing
        };

    }
]);