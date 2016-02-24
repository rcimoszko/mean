'use strict';

angular.module('fu').directive('loginForm', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/fu/client/templates/users/login-form.client.template.html',
        controller: ['$scope', '$state', 'UserAuth',  function ($scope,  $state, UserAuth){

            $scope.signin = function() {

                function cb(err){
                    if(err){
                        $scope.error = err;
                    } else {
                        $state.go('hub');
                    }
                }

                UserAuth.login($scope.form, cb);
            };

        }]
    };
});
