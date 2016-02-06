'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('messages', {
                abstract: true,
                url: '/discover',
                templateUrl: 'modules/fu/client/views/messages.client.view.html'
            })
            .state('messages.home', {
                url: '',
                templateUrl: 'modules/fu/client/views/message/messages.client.view.html'
            });
    }
]);
