'use strict';

angular.module('fu.admin').directive('adminTextbox', function () {
    return {
        restrict: 'E',
        scope: {
            label: '=',
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.textbox.client.template.html'
    };
});