'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.contestants', {
                url: '/contestants',
                templateUrl: 'modules/fu/client/views/admin/events/contestants/admin-list-contestants.client.view.html',
                controller: 'AdminListContestantsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editContestant', {
                url: '/contestants/edit/:contestantId',
                templateUrl: 'modules/fu/client/views/admin/events/contestants/admin-edit-contestant.client.view.html',
                controller: 'AdminEditContestantController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    contestantResolve: ['$stateParams', 'ApiContestants', function ($stateParams, ApiContestants) {
                        return ApiContestants.get({
                            _id: $stateParams.contestantId
                        });
                    }]
                }
            });

    }
]);
