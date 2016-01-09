'use strict';

// Setting up route
angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {

        // Home state routing
        $stateProvider
            .state('discover', {
                url: '/discover',
                templateUrl: 'modules/fu/client/views/discover.client.view.html'
            });

    }
]);
