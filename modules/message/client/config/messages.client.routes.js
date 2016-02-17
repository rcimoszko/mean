'use strict';

// Setting up route
angular.module('message').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.
            state('messages', {
                url: '/messages',
                templateUrl: '/modules/messages/views/conversations.client.view.html',
                controller: 'ConversationController',
                data: {
                    roles: ['user']
                }
            })
            .state('messages.new', {
                url: '/new',
                templateUrl: '/modules/messages/views/new-message.client.view.html',
                controller: 'MessageController',
                data: {
                    roles: ['user']
                }
            })
            .state('messages.view', {
                url: '/:conversationId',
                templateUrl: '/modules/messages/views/view-message.client.view.html',
                controller: 'MessageController',
                data: {
                    roles: ['user']
                }
            });
    }
]);