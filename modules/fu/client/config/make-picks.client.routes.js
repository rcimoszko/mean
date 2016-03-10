'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('makePicks', {
                abstract: true,
                url: '/make-picks',
                templateUrl: 'modules/fu/client/views/make-picks.client.view.html'
            })
            .state('makePicks.home', {
                url: '',
                templateUrl: 'modules/fu/client/views/make-picks/make-picks.picks.client.view.html',
                title: 'Free Online Sportsbook | FansUnite',
                description: 'Track your bets on our free online sportsbook with up-to-date odds for every sport and league.',
                keywords: 'free online sportsbook, free online sports betting, latest odds'
            })
            .state('makePicks.league', {
                url: '/:sportSlug/:leagueSlug',
                templateUrl: 'modules/fu/client/views/make-picks/make-picks.picks.client.view.html',
                description: 'Latest betting odds for every sport. Track your bets with our free online sportsbook.',
                keywords: 'free online sportsbook, free online sports betting, latest odds'
            });

    }
]);