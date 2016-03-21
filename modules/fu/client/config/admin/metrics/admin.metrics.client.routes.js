'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('admin.metricsGeneral', {
                url: '/metrics-general',
                templateUrl: 'modules/fu/client/views/admin/metrics/admin-metrics-general.client.view.html',
                controller: 'AdminMetricsGeneralController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.metricsEngagement', {
                url: '/metrics-engagement',
                templateUrl: 'modules/fu/client/views/admin/metrics/admin-metrics-engagement.client.view.html',
                controller: 'AdminMetricsEngagementController',
                data: {
                    roles: ['admin']
                }
            });

    }
]);
