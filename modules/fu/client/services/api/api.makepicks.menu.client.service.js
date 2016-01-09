'use strict';

angular.module('fu').factory('ApiMakePicksMenu', ['$resource',
    function ($resource) {
        return $resource('api/makepicks/menu', {});
    }
]);
