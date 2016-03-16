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
            if($scope.authentication.user) return  $scope.authentication.user.roles.indexOf('admin') !== -1;
        };

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if($state.current.title){
                $scope.page.meta.title = $state.current.title;
                $scope.page.meta.description = $state.current.description;
                $scope.page.meta.keywords = $state.current.keywords;
            }
        });


        $scope.resendVerificationEmail = function() {
            $scope.loading.isLoading.formSubmit = true;
            $scope.resendSuccess = $scope.resendError = null;
            $http.post('/api/verification/send').success(function(response) {
                $scope.loading.isLoading.formSubmit = false;
                $scope.resendSuccess = response.message;
            }).error(function(response) {
                $scope.loading.isLoading.formSubmit = false;
                $scope.resendError = response.message;
            });
        };

        /**
         * Walkthrough
         */

        $scope.CompletedEvent = function (scope) {
            console.log("Completed Event called");
        };

        $scope.ExitEvent = function (scope) {
            console.log("Exit Event called");
        };

        $scope.ChangeEvent = function (targetElement, scope) {
            console.log("Change Event called");
            console.log(targetElement);  //The target element
            console.log(this);  //The IntroJS object
        };

        $scope.BeforeChangeEvent = function (targetElement, scope) {
            console.log("Before Change Event called");
            console.log(targetElement);
        };

        $scope.AfterChangeEvent = function (targetElement, scope) {
            console.log("After Change Event called");
            console.log(targetElement);
        };

        $scope.IntroOptions = {
            steps:[
                {
                    element: '#step1',
                    intro: "Menu"
                },
                {
                    element: '#step2',
                    intro: "Picks Feed"
                }
            ],
            showStepNumbers: false,
            exitOnOverlayClick: true,
            exitOnEsc:true,
            nextLabel: '<strong>NEXT!</strong>',
            prevLabel: '<span style="color:green">Previous</span>',
            skipLabel: 'Exit',
            doneLabel: 'Thanks'
        };

        $scope.ShouldAutoStart = false;

    }
]);
