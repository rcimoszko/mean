'use strict';

angular.module('core').controller('ProController', ['$scope', '$state', '$anchorScroll', '$location', 'Page', 'StripeService', 'Authentication', 'Mixpanel',
    function($scope, $state, $anchorScroll, $location, Page, StripeService, Authentication, Mixpanel) {

        $anchorScroll();

        $scope.stripeService = StripeService;
        $scope.page = Page;
        $scope.mixpanel = Mixpanel;


        $scope.newSubscription = function(plan){
            if(Authentication.user){
                switch (plan){
                    case 'base':
                        $scope.stripeService.newBaseSubscription();
                        break;
                    case 'premium-1':
                        $scope.stripeService.newPremium1Subscription();
                        break;
                    case 'premium-6':
                        $scope.stripeService.newPremium6Subscription();
                        break;
                }
            } else {
                $state.go('signup');
            }
        };

        $scope.gotoAnchor = function() {
            var newHash = 'go-pro-now';
            if ($location.hash() !== newHash) {
                // set the $location.hash to `newHash` and
                // $anchorScroll will automatically scroll to it
                $location.hash('go-pro-now');
            } else {
                // call $anchorScroll() explicitly,
                // since $location.hash hasn't changed
                $anchorScroll();
            }
        };

        $scope.authentication = Authentication;

    }
]);