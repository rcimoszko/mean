'use strict';

angular.module('fu').factory('Trending', ['ApiTrending',
    function(ApiTrending) {

        var get = function(query, callback){
            function cbSuccess(trending){
                callback(null, trending);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiTrending.get(query, cbSuccess, cbError);
        };

        return {
            get: get
        };
    }
]);