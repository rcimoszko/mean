'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.groups', {
                url: '/groups',
                templateUrl: 'modules/fu/client/views/admin/events/groups/admin-list-groups.client.view.html',
                controller: 'AdminListGroupsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.createGroup', {
                url: '/groups/create',
                templateUrl: 'modules/fu/client/views/admin/events/groups/admin-create-group.client.view.html',
                controller: 'AdminCreateGroupController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editGroup', {
                url: '/groups/:groupId',
                templateUrl: 'modules/fu/client/views/admin/events/groups/admin-edit-group.client.view.html',
                controller: 'AdminEditGroupController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    groupResolve: ['$stateParams', 'ApiGroups', function ($stateParams, ApiGroups) {
                        return ApiGroups.get({
                            _id: $stateParams.groupId
                        });
                    }]
                }
            });

    }
]);
