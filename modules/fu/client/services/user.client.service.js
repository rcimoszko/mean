'use strict';

angular.module('fu').factory('User', ['Authentication',
    function(Authentication) {

        var user = {};

        return {
            user: user
        };

    }
]);