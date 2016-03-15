'use strict';

angular.module('fu.admin').directive('adminCheckmark', function () {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.checkmark.client.template.html'
    };
});