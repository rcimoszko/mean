'use strict';

angular.module('fu').factory('ApiAuth', ['$resource',
    function ($resource) {
        return $resource('api/auth/:action', {}, {
            login: { method: 'POST', params: {action: 'signin'} },
            signup: { method: 'POST', params: {action: 'signup'} }
        });
    }
]);
