'use strict';

angular.module('message').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
            state('messages', {
                url: '/messages',
                templateUrl: 'modules/message/client/views/messages.client.view.html',
                controller: 'MessagesController',
                title: 'Messages | FansUnite',
                description: '',
                keywords: '',
                abstract: true,
                data: {
                    roles: ['user']
                }
            })
            .state('messages.home', {
                url: '',
                data: {
                    roles: ['user']
                }
            })
            .state('messages.new', {
                url: '/new',
                templateUrl: 'modules/message/client/views/new-message.client.view.html',
                controller: 'NewMessageController',
                data: {
                    roles: ['user']
                }
            })
            .state('messages.newWithUser', {
                url: '/new/:username',
                templateUrl: 'modules/message/client/views/new-message.client.view.html',
                controller: 'NewMessageController',
                data: {
                    roles: ['user']
                }
            })
            .state('messages.view', {
                url: '/:conversationId',
                templateUrl: 'modules/message/client/views/view-message.client.view.html',
                controller: 'ViewMessageController',
                data: {
                    roles: ['user']
                }
            });
    }
]);