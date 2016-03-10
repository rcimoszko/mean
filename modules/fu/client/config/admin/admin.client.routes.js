'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.home', {
                url: '',
                templateUrl: 'modules/fu/client/views/admin/admin.home.client.view.html',
                controller: 'AdminHomeController',
                title: 'Admin | FansUnite'
                data: {
                    roles: ['admin']
                }
            });

    }
]);
