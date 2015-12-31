'use strict';

angular.module('fu').config(['$stateProvider',
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
            .state('admin.editLeague', {
                url: '/leagues/:leagueId',
                templateUrl: 'modules/fu/client/views/admin/events/leagues/admin-edit-league.client.view.html',
                controller: 'AdminEditLeagueController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    leagueResolve: ['$stateParams', 'ApiLeagues', function ($stateParams, ApiLeagues) {
                        return ApiLeagues.get({
                            _id: $stateParams.leagueId
                        });
                    }]
                }
            });

    }
]);
