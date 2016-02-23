'use strict';

angular.module('fu.admin').directive('adminDatetime', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.datetime.client.template.html'
    };
});