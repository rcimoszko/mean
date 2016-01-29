'use strict';

angular.module('fu').directive('pickTable', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            picks: '=',
            type: '='
        },
        template: '',
        controller: ['$scope', '$element', function ($scope, $element){

            var directive;

            switch($scope.type){
                case 'completed':
                    directive = '<pick-table-completed picks="picks"></pick-table-completed>';
                    break;
                case 'pending':
                    directive = '<pick-table-pending picks="picks"></pick-table-pending>';
                    break;

            }

            var el = $compile(directive)($scope);
            $element.append(el);

        }]
    };
});