'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin', {
                url: '/admin',
                templateUrl: 'modules/fu/client/views/admin/admin.client.view.html',
                data: {
                    roles: ['admin']
                }
            });

    }
]);
