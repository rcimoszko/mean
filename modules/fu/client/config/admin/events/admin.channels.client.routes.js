'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.channels', {
                url: '/channels',
                templateUrl: 'modules/fu/client/views/admin/events/channels/admin-list-channels.client.view.html',
                controller: 'AdminListChannelsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.createChannel', {
                url: '/channels/create',
                templateUrl: 'modules/fu/client/views/admin/events/channels/admin-create-channel.client.view.html',
                controller: 'AdminCreateChannelController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editChannel', {
                url: '/channels/:channelId',
                templateUrl: 'modules/fu/client/views/admin/events/channels/admin-edit-channel.client.view.html',
                controller: 'AdminEditChannelController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    channelResolve: ['$stateParams', 'ApiChannels', function ($stateParams, ApiChannels) {
                        return ApiChannels.get({
                            _id: $stateParams.channelId
                        });
                    }]
                }
            });

    }
]);
