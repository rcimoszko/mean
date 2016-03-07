'use strict';

angular.module('core').controller('SplashController', ['$scope', 'Modal', '$state', 'Authentication', 'Page', 'Mixpanel', 'Leaderboard',
    function($scope, Modal, $state, Authentication, Page, Mixpanel, Leaderboard) {
        $scope.authentication = Authentication;
        if($scope.authentication.user) $state.go('hub');

        $scope.page = Page;
        $scope.mixpanel = Mixpanel;


        $scope.showVideoModal = function(){
                Modal.showModal(
                '/modules/fu/client/views/splash/modal/modal-splash-video.client.view.html',
                'ModalSplashVideoController',
                {},
                'splash-video'
            );
        };


        $scope.query = {
            sportId:        'all',
            leagueId:       'all',
            contestantId:   'all',
            homeAway:       'both',
            betDuration:    'all',
            betType:        'all',
            minBets:        'all',
            dateId:         'last30Days',
            count:          5
        };

        function cb(err, leaderboard){
            $scope.leaderboard = leaderboard;
        }

        Leaderboard.getLeaderboard($scope.query, cb);

    }
]);