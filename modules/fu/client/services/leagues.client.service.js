'use strict';

angular.module('fu').factory('Leagues', ['$rootScope', 'ApiLeagues',
    function(ApiLeagues) {

        var create = function(form, callback){

            function cbSuccess(league){
                callback(null, league);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var league = new ApiLeagues(form);

            league.$save(cbSuccess, cbError);
        };

        var update = function(league, form, callback){

            function cbSuccess(league){
                callback(null, league);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeagues.update(league, form, cbSuccess, cbError);

        };

        var get = function(leagueID, callback){
            function cbSuccess(league){
                callback(null, league);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeagues.get({_id:leagueID}, cbSuccess, cbError);
        };

        var getAll = function(callback){
            function cbSuccess(leagues){
                callback(null, leagues);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeagues.query(cbSuccess, cbError);

        };

        var del = function(league, callback){
            function cbSuccess(league){
                callback(null, league);
            }

            function cbError(response){
                callback(response.data.message);
            }
            league = new ApiLeagues(league);
            league.$delete(cbSuccess, cbError);
        };

        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del
        };
    }
]);