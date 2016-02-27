'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('channel', {
                abstract:true,
                template: '<div ui-view></div>',
                url: '/channel/:channelSlug'
            })
                .state('channel.main', {
                    url: '',
                    abstract: true,
                    templateUrl: 'modules/fu/client/views/channel.client.view.html'
                })
                    .state('channel.main.home', {
                        url: '',
                        templateUrl: 'modules/fu/client/views/channels/channel-games.client.view.html'
                    })
                    .state('channel.main.date', {
                        url: '/:date',
                        templateUrl: 'modules/fu/client/views/channels/channel-games.client.view.html'
                    });

    }
]);