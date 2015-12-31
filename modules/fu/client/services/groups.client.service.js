'use strict';

angular.module('fu').factory('Groups', ['$rootScope', 'ApiGroups',
    function(ApiGroups) {

        var create = function(form, callback){

            function cbSuccess(group){
                callback(null, group);
            }

            function cbError(response){
                callback(response.data.message);
            }

            var group = new ApiGroups(form);

            group.$save(cbSuccess, cbError);
        };

        var update = function(group, form, callback){

            function cbSuccess(group){
                callback(null, group);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiGroups.update(group, form, cbSuccess, cbError);

        };

        var get = function(groupID, callback){
            function cbSuccess(group){
                callback(null, group);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiGroups.get({_id:groupID}, cbSuccess, cbError);
        };

        var getAll = function(callback){
            function cbSuccess(groups){
                callback(null, groups);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiGroups.query(cbSuccess, cbError);

        };

        var del = function(group, callback){
            function cbSuccess(group){
                callback(null, group);
            }

            function cbError(response){
                callback(response.data.message);
            }
            group = new ApiGroups(group);
            group.$delete(cbSuccess, cbError);
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