'use strict';

angular.module('fu').factory('ApiSportsResolvelist', ['$resource',
    function ($resource) {
        return $resource('api/sports/resolvelist', {});
    }
]);