'use strict';

angular.module('fu').controller('MainController', ['$scope', '$state', 'Authentication', 'User', 'Loading', '$rootScope', 'Page', '$http', '$timeout',
    function ($scope, $state, Authentication, User, Loading, $rootScope, Page, $http, $timeout) {
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
         * Picks Walkthrough
         */

        $scope.ExitPicksWalkthrough = function () {
            $scope.authentication.user.picksWalkthrough = true;
            User.update(function(err){});
        };
        $scope.CompletedPicksWalkthrough = function () {
            $scope.authentication.user.picksWalkthrough = true;
            User.update(function(err){});
        };


        $scope.MakePicksIntroOptions = {
            steps:[
                {
                    element: '#picks-step1',
                    intro: '<ul><li>150 Units to wager each week</li><li>Units reset every Monday</li><li>Units won are not returned</li><li>Units do not carry over each week</li></ul>',
                    position: 'right'
                },
                {
                    element: '#picks-step3',
                    intro: "<ul><li>Picks are added to you Bet Slip</li><li>You can bet 1-5 units per bet type, and up to 15 on a single game</li><li>Place your unit size according to your confidence.</li></ul>",
                    position: 'left'
                },
                {
                    element: '#make-picks-menu',
                    intro: "Select a League and start making picks!",
                    position: 'right'
                }
            ],
            showStepNumbers: false,
            exitOnOverlayClick: false,
            scrollToElement: false,
            exitOnEsc:true,
            nextLabel: 'NEXT',
            prevLabel: 'PREV',
            skipLabel: 'EXIT',
            doneLabel: 'DONE',
            showBullets: false
        };


        /**
         * Hub Walkthrough
         */

        $scope.CompletedHubWalkthrough  = function () {
            $scope.authentication.user.hubWalkthrough = true;
            User.update(function(err){});
        };

        $scope.ExitHubWalkthrough = function () {
            $scope.authentication.user.hubWalkthrough = true;
            User.update(function(err){});
        };

        $scope.HubIntroOptions = {
            steps:[
                {
                    element: '#hub-step1',
                    intro: 'Find upcoming picks from the community',
                    position: 'right'
                },
                {
                    element: '#hub-step2',
                    intro: "Find the most popular games and picks",
                    position: 'right'
                },
                {
                    element: '#hub-step3',
                    intro: "See what our community is discussing",
                    position: 'top'
                },
                {
                    element: '#hub-step4',
                    intro: "Check out the hottest bettors",
                    position: 'left'
                },
                {
                    element: '#hub-step5',
                    intro: "Start making picks or find more top bettors to follow!",
                    position: 'bottom'
                }

            ],
            showStepNumbers: false,
            scrollToElement: false,
            exitOnEsc:true,
            exitOnOverlayClick: false,
            nextLabel: 'NEXT',
            prevLabel: 'PREV',
            skipLabel: 'EXIT',
            doneLabel: 'DONE',
            showBullets: false
        };


    }
]);
