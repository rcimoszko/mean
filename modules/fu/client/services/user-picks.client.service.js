'use strict';

angular.module('fu').factory('UserPicks', ['$filter', 'Authentication', 'User',
    function($filter, Authentication, User){

        var pendingPicks = User.picks.pending;

        var isPicked = function(pick){
            var pickFound = $filter('filter')(pendingPicks, {bet: pick.bet});
            return pickFound.length > 0;
        };

        var isCopied = function(pick){
            var pickFound = $filter('filter')(pendingPicks, function(pendingPick){
                if('copiedFrom' in pendingPick){
                    return pendingPick.copiedFrom.pick === pick._id;
                } else {
                    return false;
                }
            });
            return pickFound.length > 0;
        };

        var isOwn = function(pick){
            return pick.user.ref._id === Authentication.user._id;
        };

        var hasStarted = function(event){
            return (new Date(event.startTime) < new Date());
        };

        return {
            isOwn: isOwn,
            isPicked: isPicked,
            isCopied: isCopied,
            hasStarted: hasStarted
        };
    }


]);
