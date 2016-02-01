'use strict';

angular.module('fu').directive('btnTracker', function () {
    return {
        restrict: 'E',
        scope: {
            username:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-tracker.client.template.html'
    };
});