'use strict';

angular.module('fu.admin').directive('adminSubmit', function () {
    return {
        restrict: 'E',
        scope: {
            error: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/edit/admin.submit.client.template.html'
    };
});