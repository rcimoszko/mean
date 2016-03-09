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
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html',
                title: 'Top Handicappers | Free Picks',
                description: 'Find the best handicapper to suit your sports betting needs. All records are fully verified and transparent, what you see is what you get.',
                keywords: 'best tipsters, top handicappers, profit, roi'
            })
            .state('discover.sport', {
                url: '/:sportSlug',
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html',
                keywords: 'best tipsters, top handicappers, profit, roi'
            })
            .state('discover.league', {
                url: '/:sportSlug/:leagueSlug',
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html',
                keywords: 'best tipsters, top handicappers, profit, roi'
            })
            .state('discover.contestant', {
                url: '/:sportSlug/:leagueSlug/:contestantSlug',
                templateUrl: 'modules/fu/client/views/discover/discover-table.client.view.html',
                keywords: 'best tipsters, top handicappers, profit, roi'
            });
    }
]);
