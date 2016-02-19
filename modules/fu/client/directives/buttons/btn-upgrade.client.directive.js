'use strict';

angular.module('fu').directive('btnUpgrade', function () {
    return {
        restrict: 'E',
        scope: {
            channelId:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-upgrade.client.template.html',
        controller: ['$scope', '$filter', 'StripeService', function($scope, $filter, StripeService){
            $scope.showSubscriptionModal = function(){
                StripeService.showSubscriptionModal();
            };
        }]
    };
});