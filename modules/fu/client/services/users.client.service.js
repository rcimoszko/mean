'use strict';

angular.module('fu').factory('Users', ['Authentication', 'ApiUserProfile', 'ApiUsers', 'ApiUsersNew',
    function(Authentication, ApiUserProfile, ApiUsers, ApiUsersNew) {

        var getProfile = function(username, callback){
            function cbSuccess(profile){
                callback(null, profile);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserProfile.get({username:username}, cbSuccess, cbError);
        };


        var getAll = function(callback){
            function cbSuccess(users){
                callback(null, users);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUsers.query(cbSuccess, cbError);
        };

        var getNew = function(callback){
            function cbSuccess(users){
                callback(null, users);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUsersNew.query(cbSuccess, cbError);
        };




        return {
            getProfile: getProfile,
            getAll: getAll,
            getNew: getNew
        };

    }
]);