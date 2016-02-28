'use strict';

angular.module('fu').controller('MainController', ['$scope', '$state', 'Authentication', 'User', 'Loading', '$rootScope', 'Page', '$http',
    function ($scope, $state, Authentication, User, Loading, $rootScope, Page, $http) {
        $scope.authentication = Authentication;
        $scope.loading = Loading;
        $scope.page = Page;

        if($scope.authentication.user && !User.info.initialized) User.initialize();

        $scope.isPicksPage = function(){
            return $state.current.name.indexOf('makePicks') !== -1;
        };
        $scope.isBlog = function(){
            return $state.current.name.indexOf('blog') !== -1;
        };
        $scope.isAdmin = function(){
            return  $scope.authentication.user.roles.indexOf('admin') !== -1;
        };

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if($state.current.title){
                $scope.page.meta.title = $state.current.title;
                $scope.page.meta.description = $state.current.description;
                $scope.page.meta.keywords = $state.current.keywords;
            }
        });


        $scope.resendVerificationEmail = function() {
            $scope.resendSuccess = $scope.resendError = null;
            $http.post('/api/verification/send').success(function(response) {
                $scope.resendSuccess = response.message;
            }).error(function(response) {
                $scope.resendError = response.message;
            });
        };
    }
]);
