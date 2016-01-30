'use strict';

angular.module('dotted.core').directive('formSelectField', function () {
    return {
        restrict: 'E',
        scope: {
            options: '=',
            label: '=',
            model: '=',
            required: '=',
            displayField: '=',
            selectField: '='
        },
        templateUrl: 'modules/dotted/client/partials/core/forms/form-select-field.html',
        controller: ['$scope','$filter', function ($scope, $filter) {
        }]
    };
});
