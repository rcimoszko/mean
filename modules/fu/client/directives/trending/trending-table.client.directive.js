'use strict';

angular.module('fu').directive('trendingTable', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            users: '=',
            type: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {
            var directive;
            console.log($scope.users);
            console.log($scope.type);

            switch($scope.type){
                case 'profit':
                    directive = '<trending-table-profit users="users"></trending-table-profit>';
                    break;
                case 'streak':
                    directive = '<trending-table-streak users="users"></trending-table-streak>';
                    break;
                case 'follows':
                    directive = '<trending-table-follows users="users"></trending-table-follows>';
                    break;
            }

            var el = $compile(directive)($scope);
            $element.append(el);

        }]
    };
});
