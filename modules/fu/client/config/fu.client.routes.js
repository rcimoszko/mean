'use strict';

// Setting up route
angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {

        // Home state routing
        $stateProvider
            .state('makePicks', {
                url: '/make-picks',
                templateUrl: 'modules/fu/client/views/make-picks.client.view.html'
            })
            .state('discover', {
                url: '/discover',
                templateUrl: 'modules/fu/client/views/discover.client.view.html'
            });

    }
]);
