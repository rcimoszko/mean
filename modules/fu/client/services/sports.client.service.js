'use strict';

angular.module('fu').factory('Sports', ['ApiSports',
    function(ApiSports) {

        var create = function(form, callback){

            function cbSuccess(sport){
                callback(null, sport);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var sport = new ApiSports(form);

            sport.$save(cbSuccess, cbError);
        };

        var update = function(sport, callback){

            function cbSuccess(sport){
                callback(null, sport);
            }

            function cbError(response){
                callback(response.data.message);
            }

            sport.$update({_id: sport._id}, cbSuccess, cbError);

        };

        var get = function(sportID, callback){
            function cbSuccess(sport){
                callback(null, sport);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSports.get({_id:sportID}, cbSuccess, cbError);
        };

        var getAll = function(callback){
            function cbSuccess(sports){
                callback(null, sports);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSports.query(cbSuccess, cbError);

        };

        var del = function(sport, callback){
            function cbSuccess(sport){
                callback(null, sport);
            }

            function cbError(response){
                callback(response.data.message);
            }
            sport = new ApiSports(sport);
            sport.$delete(cbSuccess, cbError);
        };

        var getLeagues = function(sport, callback){
            function cbSuccess(leagues){
                callback(null, leagues);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSports.getLeagues({_id: sport._id}, cbSuccess, cbError);

        };

        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del,

            getLeagues: getLeagues
        };
    }
]);