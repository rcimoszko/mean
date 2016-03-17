'use strict';

angular.module('fu').factory('Metrics', [ 'ApiMetricsGeneral',
    function(ApiMetricsGeneral) {

        var getGeneral = function(query, callback){
            function cbSuccess(metrics){
                callback(null, metrics);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiMetricsGeneral.query(query, cbSuccess, cbError);

        };

        return {
            getGeneral: getGeneral
        };
    }
]);