'use strict';

angular.module('fu').directive('signupForm', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/fu/client/templates/users/signup-form.client.template.html',
        controller: ['$scope', '$state', 'UserAuth', 'Sports', 'Loading', function ($scope, $state, UserAuth, Sports, Loading) {

            $scope.loading = Loading;

            $scope.redirectUrl = $state.params.redirect;

            if($scope.redirectUrl){
                if($scope.redirectUrl.indexOf('profile')!== -1){
                    var redirectUrl = [];
                    if($scope.redirectUrl.indexOf('/')!== -1){
                        redirectUrl = $scope.redirectUrl.split('/');
                    } else if ($scope.redirectUrl.indexOf('%2F')!== -1){
                        redirectUrl = $scope.redirectUrl.split('%2F');
                    }
                    if (redirectUrl.length){
                        $scope.username = redirectUrl[redirectUrl.length -1];
                    }
                }
            }

            $scope.signup = function(isValid) {
                $scope.error = null;
                $scope.loading.isLoading.formSubmit = true;


                if (!isValid) {
                    $scope.$broadcast('show-errors-check-validity', 'userForm');
                    $scope.invalid = true;
                    $scope.loading.isLoading.formSubmit = false;
                    return false;
                }

                function cb(err){
                    $scope.loading.isLoading.formSubmit = false;
                    if(err){
                        $scope.error = err;
                    } else {
                        if($scope.redirectUrl){
                            $state.go('signupSuccess', {redirect: $scope.redirectUrl});
                        } else{
                            $state.go('signupSuccess');
                        }
                    }
                }
                UserAuth.signup($scope.form, cb);
            };

            Sports.getAll(function(err, sports){
                $scope.sports = sports;
            });
        }]
    };
});
