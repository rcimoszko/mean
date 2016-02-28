'use strict';

angular.module('core').controller('ProController', ['$scope', '$state', '$anchorScroll', '$location', 'Page', 'StripeService', 'Authentication', 'Mixpanel', 'User',
    function($scope, $state, $anchorScroll, $location, Page, StripeService, Authentication, Mixpanel, User) {

        $anchorScroll();

        $scope.stripeService = StripeService;
        $scope.page = Page;
        $scope.mixpanel = Mixpanel;
        $scope.user = User;


        $scope.newSubscription = function(plan){
            function cb(err){
                if(err){
                    $scope.error = err;
                } else {
                    switch(plan){
                        case 'base':
                            $state.go('basePurchaseSuccess');
                            break;
                        case 'premium-1':
                            $state.go('proPurchaseSuccess');
                            break;
                        case 'premium-6':
                            $state.go('6monthProPurchaseSuccess');
                            break;
                    }
                }
            }


            if(Authentication.user){
                switch (plan){
                    case 'base':
                        $scope.stripeService.newBaseSubscription(cb);
                        break;
                    case 'premium-1':
                        $scope.stripeService.newPremium1Subscription(cb);
                        break;
                    case 'premium-6':
                        $scope.stripeService.newPremium6Subscription(cb);
                        break;
                }
            } else {
                $state.go('signup');
            }
        };


        $scope.changeSubscription = function(plan){
            function cb(err){
                if(!err) $scope.success = 'Updated Subscription';
                console.log(err);
            }

            $scope.stripeService.changeSubscription(plan, cb);
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