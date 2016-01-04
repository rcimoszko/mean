'use strict';

angular.module('fu.admin').directive('adminSelectRef', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            options: '=',
            displayField: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.select.ref.client.template.html'
    };
});