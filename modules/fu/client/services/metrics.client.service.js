'use strict';

angular.module('fu').factory('Metrics', [ 'ApiMetrics',
    function(ApiMetrics) {

        var get = function(query, callback){
            function cbSuccess(metrics){
                callback(null, metrics);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiMetrics.query(query, cbSuccess, cbError);

        };

        return {
            get: get
        };
    }
]);