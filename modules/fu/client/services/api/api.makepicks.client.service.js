'use strict';

angular.module('fu').factory('ApiMakePicks', ['$resource',
    function ($resource) {
        return $resource('api/makepicks', {});
    }
]);