'use strict';

angular.module('fu').directive('loading', function () {
    return {
        restrict: 'E',
        scope: {
            isLoading: '=',
            color: '=',
            bgColor: '=',
            size:'='
        },
        templateUrl: 'modules/fu/client/templates/general/loading.client.template.html'
    };
});