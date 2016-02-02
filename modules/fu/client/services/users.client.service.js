'use strict';

angular.module('fu').factory('Users', ['Authentication', 'ApiUserProfile',
    function(Authentication, ApiUserProfile) {

        var getProfile = function(username, callback){
            function cbSuccess(profile){
                callback(null, profile);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiUserProfile.get({username:username}, cbSuccess, cbError);
        };

        return {
            getProfile: getProfile
        };

    }
]);