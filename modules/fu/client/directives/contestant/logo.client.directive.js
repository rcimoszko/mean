'use strict';

angular.module('fu').directive('logo', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            contestantName: '=',
            size: '='
        },
        templateUrl: 'modules/fu/client/templates/contestant/logo.client.template.html',
        controller: ['$scope',  function ($scope){

        }]
    };
});
