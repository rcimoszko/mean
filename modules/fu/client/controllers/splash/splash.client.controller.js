'use strict';

angular.module('core').controller('SplashController', ['$scope', 'Modal', '$state', 'Authentication', 'Page', 'Mixpanel',
    function($scope, Modal, $state, Authentication, Page, Mixpanel) {
        $scope.authentication = Authentication;
        if($scope.authentication.user) $state.go('hub');

        Page.setTitle('FansUnite | Betting Tips, Free Picks, Odds and Scores');
        Page.setDescription('Sports betting community for handicappers looking to get free picks, practice their betting strategy and see where the top guys are actually putting their money.');
        Page.setKeywords('sports betting community, free sports picks, learn how to bet verified handicappers, fansunite');

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
    }
]);