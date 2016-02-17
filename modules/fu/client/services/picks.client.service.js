'use strict';

angular.module('fu').factory('Picks', ['ApiPicksComments',
    function(ApiPicksComments) {

        var getComments = function(pick, callback){
            function cbSuccess(comments){
                callback(null, comments);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPicksComments.query({_id:pick._id}, cbSuccess, cbError);
        };

        return {
            getComments: getComments
        };
    }
]);