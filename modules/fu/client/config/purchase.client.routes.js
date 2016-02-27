'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('basePurchaseSuccess', {
                url: '/base-purchase-success?redirect',
                templateUrl: 'modules/fu/client/views/purchase/base-purchase-success.client.view.html',
                title: 'Thank You for Purchasing Email Notifications | FansUnite',
                data: {
                    roles: ['user']
                }
            })
            .state('proPurchaseSuccess', {
                url: '/pro-purchase-success?redirect',
                templateUrl: 'modules/fu/client/views/purchase/base-purchase-success.client.view.html',
                title: 'Thank You for Purchasing FansUnite Pro | FansUnite',
                data: {
                    roles: ['user']
                }
            })
            .state('6monthProPurchaseSuccess', {
                url: '/six-pro-purchase-success?redirect',
                templateUrl: 'modules/fu/client/views/purchase/base-purchase-success.client.view.html',
                title: 'Thank You for Purchasing 6 Months FansUnite Pro | FansUnite',
                data: {
                    roles: ['user']
                }
            })
            .state('trialSuccess', {
                url: '/trial-pro-purchase-success?redirect',
                templateUrl: 'modules/fu/client/views/purchase/base-purchase-success.client.view.html',
                title: 'Thank You for Signing up for a Free Trial | FansUnite',
                data: {
                    roles: ['user']
                }
            });
    }
]);
