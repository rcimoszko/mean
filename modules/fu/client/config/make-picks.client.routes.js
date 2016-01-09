'use strict';

// Setting up route
angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {

        // Home state routing
        $stateProvider
            .state('makePicks', {
                abstract: true,
                url: '/make-picks',
                templateUrl: 'modules/fu/client/views/make-picks.client.view.html'
            })
            .state('makePicks.home', {
                url: '',
                templateUrl: 'modules/fu/client/views/make-picks/make-picks.picks.client.view.html'
            })
            .state('makePicks.league', {
                url: '/:sportSlug/:leagueSlug',
                templateUrl: 'modules/fu/client/views/make-picks/make-picks.picks.client.view.html'
            });

    }
]);
