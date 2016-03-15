'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('admin.newUsers', {
                url: '/new-users',
                templateUrl: 'modules/fu/client/views/admin/users/admin-new-users.client.view.html',
                controller: 'AdminNewUsersController',
                data: {
                    roles: ['admin']
                }
            });

    }
]);
