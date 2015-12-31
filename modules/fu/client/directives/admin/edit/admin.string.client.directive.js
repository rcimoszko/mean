'use strict';

angular.module('fu.admin').directive('adminString', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.string.client.template.html'
    };
});