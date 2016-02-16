'use strict';

angular.module('fu').directive('avatar', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            username: '=',
            size: '='
        },
        templateUrl: 'modules/fu/client/templates/users/avatar.client.template.html',
        controller: ['$scope',  function ($scope){

        }]
    };
});
