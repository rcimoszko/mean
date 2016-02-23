'use strict';

angular.module('fu.admin').directive('adminTime', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.time.client.template.html'
    };
});