'use strict';

angular.module('fu').controller('ModalStripeController', ['$scope', '$modalInstance', '$state', 'Modal', 'StripeService', 'Authentication',
    function($scope, $modalInstance, $state, Modal, StripeService, Authentication) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
        $scope.stripeService = StripeService;

        function cb(err){

        }

        $scope.newSubscription = function(plan){
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