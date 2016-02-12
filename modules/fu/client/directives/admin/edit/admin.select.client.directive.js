'use strict';

angular.module('fu.admin').directive('adminSelect', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            options: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.select.client.template.html'
    };
});