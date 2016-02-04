'use strict';

angular.module('fu').factory('ApiTrending', ['$resource',
    function ($resource) {
        return $resource('api/trending', {});
    }
]);