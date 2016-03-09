'use strict';

angular.module('fu').controller('StaticController', ['$scope', '$location', '$anchorScroll', '$state', 'Authentication', 'Page',
    function($scope, $location, $anchorScroll, $state, Authentication, Page) {

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if($state.current.title){
                Page.meta.title = $state.current.title;
                Page.meta.description = $state.current.description;
                Page.meta.keywords = $state.current.keywords;
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

