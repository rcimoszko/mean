'use strict';

angular.module('fu').factory('Trial', ['ApiTrialActivate', 'Authentication', 'User', 'GaEcommerce',
    function(ApiTrialActivate, Authentication, User, GaEcommerce) {

        var activate = function(callback){
            function cbSuccess(user){
                Authentication.user = user;
                GaEcommerce.sendTransaction(user._id, 'Trial', '0.00');
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