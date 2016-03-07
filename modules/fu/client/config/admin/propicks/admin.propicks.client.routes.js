'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.allProPicks', {
                url: '/propicks/all',
                templateUrl: 'modules/fu/client/views/admin/propicks/admin-propicks-all.client.view.html',
                controller: 'AdminPropicksAllController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.sportProPicksMonth', {
                url: '/propicks/sport/mont',
                templateUrl: 'modules/fu/client/views/admin/propicks/admin-propicks-sport-month.client.view.html',
                controller: 'AdminPropicksSportMonthController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.leagueProPicksMonth', {
                url: '/propicks/league/month',
                templateUrl: 'modules/fu/client/views/admin/propicks/admin-propicks-league-month.client.view.html',
                controller: 'AdminPropicksLeagueMonthController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.sportProPicksTotals', {
                url: '/propicks/sport/totals',
                templateUrl: 'modules/fu/client/views/admin/propicks/admin-propicks-sport-totals.client.view.html',
                controller: 'AdminPropicksSportTotalsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.leagueProPicksTotals', {
                url: '/propicks/league/totals',
                templateUrl: 'modules/fu/client/views/admin/propicks/admin-propicks-league-totals.client.view.html',
                controller: 'AdminPropicksLeagueTotalsController',
                data: {
                    roles: ['admin']
                }
            });

    }
]);
