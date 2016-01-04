'use strict';

angular.module('fu').factory('Leagues', ['ApiLeagues',
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

        var update = function(league, callback){

            function cbSuccess(league){
                callback(null, league);
            }

            function cbError(response){
                callback(response.data.message);
            }

            league.$update({_id: league._id}, cbSuccess, cbError);

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

        var getContestants = function(leagueId, callback){
            function cbSuccess(contestants){
                callback(null, contestants);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiLeagues.getContestants({_id: leagueId}, cbSuccess, cbError);

        };

        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del,

            getContestants: getContestants
        };
    }
]);