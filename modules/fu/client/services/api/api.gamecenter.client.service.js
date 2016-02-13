'use strict';

angular.module('fu').factory('ApiGamecenter', ['$resource',
    function ($resource) {
        return $resource('api/gamecenter/:eventSlug/:leagueSlug', { eventSlug: '@eventSlug', leagueSlug:'@leagueSlug' });
    }
]);