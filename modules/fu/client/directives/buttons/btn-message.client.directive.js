'use strict';

angular.module('fu').directive('btnMessage', function () {
    return {
        restrict: 'E',
        scope: {
            username:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-message.client.template.html',
        controller: ['$scope', function($scope){

        }]
    };
});
