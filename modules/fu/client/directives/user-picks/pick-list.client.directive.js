'use strict';

angular.module('fu').directive('pickList', function () {
    return {
        restrict: 'E',
        scope: {
            picks: '=',
            event: '=',
            includeUser: '='
        },
        templateUrl: 'modules/fu/client/templates/user-picks/pick-list.client.template.html',
        controller: ['$scope', 'UserPicks', 'BetSlip', function ($scope, UserPicks, BetSlip){

            $scope.userPicks = UserPicks;


            $scope.copyPick = function(pick, event){

                if(!$scope.userPicks.hasStarted(event) && !$scope.userPicks.isOwn(pick) && !$scope.userPicks.isCopied(pick) && !$scope.userPicks.isPicked(pick)){
                    var newPick = pick.bet;
                    newPick.copiedFrom = {user: {name: pick.user.name, ref: pick.user.ref._id}, pick: pick._id};
                    if('copiedOrigin' in pick){
                        newPick.copiedOrigin = pick.copiedOrigin;
                    } else {
                        newPick.copiedOrigin = newPick.copiedFrom;
                    }
                    console.log(newPick);
                    BetSlip.addRemove(newPick, event);
                }
            };

        }]
    };
});