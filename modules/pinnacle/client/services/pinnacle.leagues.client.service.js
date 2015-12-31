'use strict';

angular.module('pinnacle').factory('PinnacleLeagues', ['ApiPinnacleLeagues',
    function(ApiPinnacleLeagues) {

        var getAll = function(callback){

            function cbSuccess(articles){
                callback(null, articles);
            }

            function cbError(err){
                callback(err);
            }

            ApiPinnacleLeagues.query(cbSuccess, cbError);
        };


        return {
            getAll: getAll
        };

    }
]);