'use strict';

angular.module('fu').factory('UserAuth', ['Authentication', 'ApiAuth', 'User', 'Mixpanel',
    function(Authentication, ApiAuth, User, Mixpanel) {

        var signup = function(form, callback){

            function cbSuccess(response){
                Authentication.user = response;
                User.initialize();
                callback(null);
            }

            function cbFailure(response){
                callback(response.data.message);
            }

            ApiAuth.signup(form, cbSuccess, cbFailure);
        };

        var login = function(form, callback){

            function cbSuccess(response){
                Authentication.user = response;
                Mixpanel.login();
                User.initialize();
                callback(null);
            }

            function cbFailure(response){
                callback(response.data.message);
            }

            ApiAuth.login(form, cbSuccess, cbFailure);
        };

        return {
            signup: signup,
            login: login
        };

    }
]);