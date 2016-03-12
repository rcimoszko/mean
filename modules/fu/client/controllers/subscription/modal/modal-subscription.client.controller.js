'use strict';

angular.module('fu').controller('ModalSubscriptionController', ['$scope', '$modalInstance', '$state', 'Modal', 'StripeService', 'Authentication', '$location', 'User',
    function($scope, $modalInstance, $state, Modal, StripeService, Authentication, $location, User) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
        $scope.stripeService = StripeService;
        $scope.authentication = Authentication;
        $scope.modal.closeModal($scope.modalInstance);
        $scope.location = $location;
        $scope.user = User;

        $scope.newSubscription = function(plan){
            function cb(err){
                if(err){
                    $scope.error = err;
                } else {
                    $scope.modal.closeModal($scope.modalInstance);
                    switch(plan){
                        case 'base':
                            $state.go('basePurchaseSuccess', {redirect:$scope.location.path()});
                            break;
                        case 'premium-1':
                            $state.go('proPurchaseSuccess', {redirect:$scope.location.path()});
                            break;
                        case 'premium-6':
                            $state.go('6monthProPurchaseSuccess', {redirect:$scope.location.path()});
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
                if(!err) $scope.success = 'Thank you for updating your subscription to '+ plan;
                if(err) $scope.error = err;
            }

            $scope.stripeService.changeSubscription(plan, cb);
        };

        $scope.close = function(){
            $modalInstance.dismiss();
        };
    }
]);