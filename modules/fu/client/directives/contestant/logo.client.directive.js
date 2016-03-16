'use strict';

angular.module('fu').directive('logo', function () {
    return {
        restrict: 'E',
        scope: {
            url: '=',
            contestantName: '=',
            size: '='
        },
        templateUrl: 'modules/fu/client/templates/contestant/logo.client.template.html',
        controller: ['$scope',  function ($scope){
            var insert = '';
            var subString = $scope.url.substring(0, $scope.url.lastIndexOf('/'));
            var index = subString.lastIndexOf('/');

            switch($scope.size){
                case 'xs':
                    insert = '/c_fit,h_25/f_auto';
                    break;
                case 'sm':
                    insert = '/c_fit,h_30/f_auto';
                    break;
                case 'md':
                    insert = '/c_fit,h_60/f_auto';
                    break;
                case 'lg':
                    insert = '/c_fit,h_90/f_auto';
                    break;
            }

            $scope.url = $scope.url.slice(0, index) + insert + $scope.url.slice(index);

        }]
    };
});
