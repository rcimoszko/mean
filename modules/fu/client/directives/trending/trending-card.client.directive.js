'use strict';

angular.module('fu').directive('trendingCard', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            user: '=',
            value: '=',
            type: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {
            var directive;

            switch($scope.type){
                case 'profit':
                    directive = '<trending-card-profit user="user" value="value"></trending-card-profit>';
                    break;
                case 'streak':
                    directive = '<trending-card-streak user="user" value="value"></trending-card-streak>';
                    break;
                case 'follows':
                    directive = '<trending-card-follows user="user" value="value"></trending-card-follows>';
                    break;
            }

            var el = $compile(directive)($scope);
            $element.append(el);

        }]
    };
});
