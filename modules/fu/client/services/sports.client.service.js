'use strict';

angular.module('fu').factory('Sports', ['ApiSports', 'ApiSportsResolvelist',
    function(ApiSports, ApiSportsResolvelist) {

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

        var getLeagues = function(sportId, callback){
            function cbSuccess(leagues){
                callback(null, leagues);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSports.getLeagues({_id: sportId}, cbSuccess, cbError);

        };

        var getContestants = function(sportId, callback){
            function cbSuccess(contestants){
                callback(null, contestants);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSports.getContestants({_id: sportId}, cbSuccess, cbError);

        };

        var getGroups = function(sportId, callback){
            function cbSuccess(groups){
                callback(null, groups);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSports.getGroups({_id: sportId}, cbSuccess, cbError);

        };

        var getResolveList = function(callback){

            function cbSuccess(sports){
                callback(null, sports);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSportsResolvelist.query(cbSuccess, cbError);

        };

        var getResolveEvents = function(sportId, callback){


            function cbSuccess(sports){
                callback(null, sports);
            }

            function cbError(response){
                callback(response.data.message);
            }

            console.log(sportId);
            ApiSports.getResolveEvents({_id: sportId}, cbSuccess, cbError);

        };

        return {
            get:    get,
            getAll: getAll,
            create: create,
            update: update,
            delete: del,

            getLeagues: getLeagues,
            getContestants: getContestants,
            getGroups: getGroups,

            getResolveList: getResolveList,
            getResolveEvents: getResolveEvents
        };
    }
]);