'use strict';

angular.module('fu').factory('ApiHubPicks', ['$resource',
    function ($resource) {
        return $resource('api/hub/picks', {});
    }
]);