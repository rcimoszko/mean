'use strict';

angular.module('fu').directive('btnPendingPicks', function () {
    return {
        restrict: 'E',
        scope: {
            username:'=',
            pickCount: '='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-pending-picks.client.template.html'
    };
});