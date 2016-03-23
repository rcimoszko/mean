'use strict';

angular.module('fu').factory('Users', ['Authentication', 'ApiUserProfile', 'ApiUsers', 'ApiUsersNew', 'ApiUsersFollowing', 'ApiUsersFollowers',
    function(Authentication, ApiUserProfile, ApiUsers, ApiUsersNew, ApiUsersFollowing, ApiUsersFollowers) {

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

        var getFollowing = function(userId, callback){

            function cbSuccess(users){
                callback(null, users);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUsersFollowing.query({userId: userId}, cbSuccess, cbError);
        };

        var getFollowers = function(userId, callback){
            function cbSuccess(users){
                callback(null, users);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUsersFollowers.query({userId: userId}, cbSuccess, cbError);
        };


        return {
            getProfile: getProfile,
            getFollowing: getFollowing,
            getFollowers: getFollowers,
            getAll: getAll,
            getNew: getNew
        };

    }
]);