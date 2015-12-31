'use strict';

angular.module('fu').factory('Contestants', ['ApiContestants',
    function(ApiContestants) {

        var create = function(form, callback){

            function cbSuccess(contestant){
                callback(null, contestant);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var contestant = new ApiContestants(form);

            contestant.$save(cbSuccess, cbError);
        };

        var update = function(contestant, callback){

            function cbSuccess(sport){
                callback(null, sport);
            }

            function cbError(response){
                callback(response.data.message);
            }

            contestant.$update({_id: contestant._id}, cbSuccess, cbError);

        };


        var get = function(contestantID, callback){
            function cbSuccess(contestant){
                callback(null, contestant);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiContestants.get({_id:contestantID}, cbSuccess, cbError);
        };

        var getAll = function(callback){
            function cbSuccess(contestants){
                callback(null, contestants);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiContestants.query(cbSuccess, cbError);

        };

        var del = function(contestant, callback){
            function cbSuccess(contestant){
                callback(null, contestant);
            }

            function cbError(response){
                callback(response.data.message);
            }
            contestant = new ApiContestants(contestant);
            contestant.$delete(cbSuccess, cbError);
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