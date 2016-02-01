'use strict';

angular.module('fu').directive('btnShare', function () {
    return {
        restrict: 'E',
        scope: {
            pick: '='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-share.client.template.html'
    };
});