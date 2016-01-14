'use strict';

angular.module('fu').factory('UserAuth', ['Authentication', 'ApiAuth',
    function(Authentication, ApiAuth) {

        var signup = function(form, callback){

            function cbSuccess(response){
                Authentication.user = response;
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