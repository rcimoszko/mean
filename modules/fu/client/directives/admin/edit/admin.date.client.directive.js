'use strict';

angular.module('fu.admin').directive('adminDate', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.date.client.template.html'
    };
});