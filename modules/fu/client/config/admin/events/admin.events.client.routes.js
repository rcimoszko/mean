'use strict';

angular.module('fu.admin').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider
            .state('admin.events', {
                url: '/events',
                templateUrl: 'modules/fu/client/views/admin/events/events/admin-list-events.client.view.html',
                controller: 'AdminListEventsController',
                data: {
                    roles: ['admin']
                }
            })
            .state('admin.editEvent', {
                url: '/events/edit/:eventId',
                templateUrl: 'modules/fu/client/views/admin/events/events/admin-edit-event.client.view.html',
                controller: 'AdminEditEventController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    eventResolve: ['$stateParams', 'ApiEvents', function ($stateParams, ApiEvents) {
                        return ApiEvents.get({
                            _id: $stateParams.eventId
                        });
                    }]
                }
            })
            .state('adminEditEvent', {
                url: '/game/:eventSlug/:leagueSlug/edit',
                templateUrl: 'modules/fu/client/views/admin/events/events/admin-edit-event.client.view.html',
                controller: 'AdminEditEventController',
                data: {
                    roles: ['admin']
                },
                resolve: {
                    eventResolve: ['$stateParams', 'ApiEventsSlug', function ($stateParams, ApiEventsSlug) {
                        return ApiEventsSlug.get({
                            slug: $stateParams.eventSlug
                        });
                    }]
                }
            });

    }
]);
