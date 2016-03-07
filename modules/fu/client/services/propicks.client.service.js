'use strict';

angular.module('fu').factory('Propicks', ['ApiPropicksSport', 'ApiPropicksLeague', 'ApiPropicksAll', 'ApiPropicksSportTotals', 'ApiPropicksLeagueTotals',
    function(ApiPropicksSport, ApiPropicksLeague, ApiPropicksAll, ApiPropicksSportTotals, ApiPropicksLeagueTotals) {

        var getAll = function(callback){
            function cbSuccess(proPicks){
                callback(null, proPicks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPropicksAll.query({}, cbSuccess, cbError);
        };

        var getBySport = function(callback){

            function cbSuccess(proPicks){
                callback(null, proPicks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPropicksSport.get({}, cbSuccess, cbError);

        };

        var getByLeague = function(callback){

            function cbSuccess(proPicks){
                callback(null, proPicks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPropicksLeague.get({}, cbSuccess, cbError);

        };


        var getTotalsBySport = function(callback){

            function cbSuccess(proPicks){
                callback(null, proPicks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPropicksSportTotals.query({}, cbSuccess, cbError);

        };

        var getTotalsByLeague = function(callback){

            function cbSuccess(proPicks){
                callback(null, proPicks);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiPropicksLeagueTotals.query({}, cbSuccess, cbError);

        };

        return {
            getAll:      getAll,
            getBySport:  getBySport,
            getByLeague: getByLeague,
            getTotalsBySport: getTotalsBySport,
            getTotalsByLeague: getTotalsByLeague
        };
    }
]);