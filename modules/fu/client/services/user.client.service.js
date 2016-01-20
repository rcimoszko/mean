'use strict';

angular.module('fu').factory('User', ['Authentication',
    function(Authentication) {

        var picks = [];

        return {
            picks: picks
        };

    }
]);