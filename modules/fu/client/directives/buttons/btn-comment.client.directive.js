'use strict';

angular.module('fu').directive('btnComment', function () {
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-comment.client.template.html'
    };
});