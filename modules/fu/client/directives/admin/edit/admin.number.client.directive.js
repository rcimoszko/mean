'use strict';

angular.module('fu.admin').directive('adminNumber', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.number.client.template.html'
    };
});