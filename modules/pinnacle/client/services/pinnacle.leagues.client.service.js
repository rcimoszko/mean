'use strict';

angular.module('news').factory('PinnacleLeagues', ['ApiPinnacleLeagues',
    function(ApiPinnacleLeagues) {

        var getAll = function(callback){

            function cbSuccess(articles){
                callback(null, articles);
            }

            function cbError(err){
                callback(err);
            }

            ApiArticles.query(cbSuccess, cbError);
        };


        return {
            getAll: getAll
        };

    }
]);