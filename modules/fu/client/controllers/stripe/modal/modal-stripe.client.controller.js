'use strict';

angular.module('fu').controller('ModalStripeController', ['$scope', '$modalInstance', '$state', 'Modal', 'StripeService', 'Authentication', '$location',
    function($scope, $modalInstance, $state, Modal, StripeService, Authentication, $location) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
        $scope.stripeService = StripeService;
        $scope.modal.closeModal($scope.modalInstance);
        $scope.location = $location;



        $scope.newSubscription = function(plan){


            function cb(err){
                if(!err){
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
        /*
        $scope.newSubscription = function(months){
            switch(months){
                case 1:
                    StripeService.new1MonthSubscription(function(response){
                        if(response.type === 'error'){
                            $scope.error = response.message;
                        } else if (response.type === 'success'){
                            $scope.success = 'You have successfully upgraded to the FansUnite Pro account.';
                            Authentication.user = response.user;
                        }
                    });
                    break;
                case 6:
                    StripeService.new6MonthSubscription(function(response){
                        if(response.type === 'error'){
                            $scope.error = response.message;
                        } else if (response.type === 'success'){
                            $scope.success = 'You have successfully upgraded to the FansUnite Pro account.';
                            Authentication.user = response.user;
                        }
                    });
                    break;
                case 12:
                    StripeService.new12MonthSubscription(function(response){
                        if(response.type === 'error'){
                            $scope.error = response.message;
                        } else if (response.type === 'success'){
                            $scope.success = 'You have successfully upgraded to the FansUnite Pro account.';
                            Authentication.user = response.user;
                        }
                    });
                    break;

            }

        };
        */

        $scope.close = function(){
            $modalInstance.dismiss();
        };
    }
]);