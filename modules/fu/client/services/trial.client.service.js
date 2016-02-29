'use strict';

angular.module('fu').factory('Trial', ['ApiTrialActivate', 'Authentication', 'User',
    function(ApiTrialActivate, Authentication, User) {

        var activate = function(callback){
            function cbSuccess(user){
                Authentication.user = user;
                User.updateUserStatus();
                callback(null);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiTrialActivate.get({}, cbSuccess, cbError);
        };

        return {
            activate: activate
        };
    }
]);