'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('discover', {
                abstract: true,
                url: '/discover',
                templateUrl: 'modules/fu/client/views/discover.client.view.html'
            })
            .state('discover.home', {
                url: '',
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html'
            })
            .state('discover.sport', {
                url: '/:sportSlug',
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html'
            })
            .state('discover.league', {
                url: '/:sportSlug/:leagueSlug',
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html'
            })
            .state('discover.contestant', {
                url: '/:sportSlug/:leagueSlug/:contestantSlug',
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html'
            });
    }
]);
