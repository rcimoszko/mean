'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('admin.metricsEngagement', {
                url: '/engagement-metrics',
                templateUrl: 'modules/fu/client/views/admin/metrics/admin-metrics-engagement.client.view.html',
                controller: 'AdminMetricsEngagementController',
                data: {
                    roles: ['admin']
                }
            });

    }
]);
