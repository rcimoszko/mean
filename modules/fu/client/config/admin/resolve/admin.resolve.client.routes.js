'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('admin.resolveSports', {
                url: '/resolve',
                templateUrl: 'modules/fu/client/views/admin/resolve/admin-resolve-list-sports.client.view.html',
                controller: 'AdminResolveListSportsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.resolveSport', {
                url: '/resolve/:sportId',
                templateUrl: 'modules/fu/client/views/admin/resolve/admin-resolve-sport.client.view.html',
                controller: 'AdminResolveSportController',
                data: {
                    roles: ['admin']
                }
            });

    }
]);
