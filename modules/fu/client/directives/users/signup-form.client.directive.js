'use strict';

angular.module('fu').directive('signupForm', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/fu/client/templates/users/signup-form.client.template.html',
        controller: ['$scope', '$state', 'UserAuth', function ($scope, $state, UserAuth) {

            $scope.signup = function() {
                $scope.error = null;

                function cb(err){
                    if(err){
                        $scope.error = err;
                    } else {
                        $state.go('home');
                    }
                }
                UserAuth.signup($scope.form, cb);

            };
        }]
    };
});
