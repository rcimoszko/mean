'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.leagues', {
                url: '/leagues',
                templateUrl: 'modules/fu/client/views/admin/events/leagues/admin-list-leagues.client.view.html',
                controller: 'AdminListLeaguesController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.leaguesBySport', {
                url: '/leagues/:sportId',
                templateUrl: 'modules/fu/client/views/admin/events/leagues/admin-list-leagues.client.view.html',
                controller: 'AdminListLeaguesController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editLeague', {
                url: '/leagues/edit/:leagueId',
                templateUrl: 'modules/fu/client/views/admin/events/leagues/admin-edit-league.client.view.html',
                controller: 'AdminEditLeagueController',
                data: {
                    roles: ['admin']
                }
            });

    }
]);
