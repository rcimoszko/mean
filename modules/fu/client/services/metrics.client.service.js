'use strict';

angular.module('fu').factory('Metrics', [ 'ApiMetrics',
    function(ApiMetrics) {

        var get = function(callback){
            function cbSuccess(metrics){
                callback(null, metrics);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiMetrics.query(cbSuccess, cbError);

        };

        return {
            get: get
        };
    }
]);