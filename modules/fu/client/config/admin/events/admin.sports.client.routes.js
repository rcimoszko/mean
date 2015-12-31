'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.sports', {
                url: '/sports',
                templateUrl: 'modules/fu/client/views/admin/events/sports/admin-list-sports.client.view.html',
                controller: 'AdminListSportsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editSport', {
                url: '/sports/:sportId',
                templateUrl: 'modules/fu/client/views/admin/events/sports/admin-edit-sport.client.view.html',
                controller: 'AdminEditSportController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    sportResolve: ['$stateParams', 'ApiSports', function ($stateParams, ApiSports) {
                        return ApiSports.get({
                            _id: $stateParams.sportId
                        });
                    }]
                }
            });

    }
]);
