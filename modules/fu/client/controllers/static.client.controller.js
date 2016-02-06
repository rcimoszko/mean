'use strict';

angular.module('fu').controller('StaticController', ['$scope', '$location', '$anchorScroll', '$state', 'Authentication', 'Page',
    function($scope, $location, $anchorScroll, $state, Authentication, Page) {

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if($state.current.title){
                Page.setTitle($state.current.title);
                Page.setDescription($state.current.description);
                Page.setKeywords($state.current.keywords);
            }
        });

        // Scroll to Div
        $scope.scrollTo = function(id) {
            $location.hash(id);
            $anchorScroll();
        };

        //Accordion
        $scope.oneAtATime = false;

        $scope.opened = false;

        $scope.isCollapsed = false;
    }
]);

