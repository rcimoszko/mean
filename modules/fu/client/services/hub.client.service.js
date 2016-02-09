'use strict';

angular.module('fu').factory('Hub', ['ApiHub', 'ApiHubPicks',
    function(ApiHub, ApiHubPicks) {

        var getHub = function(callback){
            function cbSuccess(hub){
                callback(null, hub);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiHub.get({}, cbSuccess, cbError);
        };

        var getPicks = function(query, callback){
            function cbSuccess(hub){
                callback(null, hub);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiHubPicks.query(query, cbSuccess, cbError);

        };


        return {
            getHub: getHub,
            getPicks: getPicks
        };
    }
]);