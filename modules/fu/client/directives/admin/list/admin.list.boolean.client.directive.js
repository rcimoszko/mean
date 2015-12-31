'use strict';

angular.module('fu.admin').directive('adminListBoolean', function () {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'modules/fu/client/templates/admin/list/admin.list.boolean.client.template.html'
    };
});