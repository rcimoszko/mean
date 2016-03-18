'use strict';

angular.module('fu').factory('Metrics', [ 'ApiMetricsGeneral', 'ApiMetricsEngagement',
    function(ApiMetricsGeneral, ApiMetricsEngagement) {

        var getGeneral = function(query, callback){
            function cbSuccess(metrics){
                callback(null, metrics);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiMetricsGeneral.query(query, cbSuccess, cbError);

        };

        var getEngagement = function(query, callback){
            function cbSuccess(metrics){
                callback(null, metrics);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiMetricsEngagement.query(query, cbSuccess, cbError);

        };

        return {
            getGeneral: getGeneral,
            getEngagement: getEngagement
        };
    }
]);