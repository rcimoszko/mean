'use strict';

angular.module('fu.admin').directive('adminBoolean', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.boolean.client.template.html'
    };
});