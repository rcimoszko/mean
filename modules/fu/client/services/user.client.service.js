'use strict';

angular.module('fu').factory('User', ['Authentication', 'ApiUserPicksPending', 'ApiUserPicksCompleted',
    function(Authentication, ApiUserPicksPending, ApiUserPicksCompleted) {

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

        var picks = {pending:[]};

        return {
            picks: picks,
            getPendingPicks: getPendingPicks,
            getCompletedPicks: getCompletedPicks
        };

    }
]);