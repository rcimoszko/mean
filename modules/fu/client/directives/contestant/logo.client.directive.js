'use strict';

angular.module('fu').directive('logo', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            size: '='
        },
        templateUrl: 'modules/fu/client/templates/contestant/logo.client.template.html',
        controller: ['$scope',  function ($scope){

        }]
    };
});
