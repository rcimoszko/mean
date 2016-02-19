'use strict';

angular.module('fu').controller('ModalStripeController', ['$scope', '$modalInstance', 'Modal', 'StripeService', 'Authentication',
    function($scope, $modalInstance, Modal, StripeService, Authentication) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;

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

        $scope.close = function(){
            $modalInstance.dismiss();
        };
    }
]);