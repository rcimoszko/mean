'use strict';

angular.module('fu').factory('Gamecenter', ['ApiGamecenter',
    function(ApiGamecenter) {

        var get = function(eventSlug, leagueSlug, callback){

            function cbSuccess(gamecenter){
                callback(null, gamecenter);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiGamecenter.get({eventSlug:eventSlug, leagueSlug:leagueSlug}, cbSuccess, cbError);
        };


        return {
            get:  get
        };

    }
]);