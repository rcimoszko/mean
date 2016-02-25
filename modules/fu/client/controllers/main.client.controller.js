'use strict';

angular.module('fu').controller('MainController', ['$scope', '$state', 'Authentication', 'User', 'Loading', '$rootScope', 'Page',
    function ($scope, $state, Authentication, User, Loading, $rootScope, Page) {
        $scope.authentication = Authentication;
        $scope.loading = Loading;
        $scope.page = Page;

        if($scope.authentication.user && !User.info.initialized) User.initialize();
        $scope.isPicksPage = function(){
            return $state.current.name.indexOf('makePicks') !== -1;
        };
        $scope.isBlog = function(){
            return $state.current.name.indexOf('blog') !== -1;
        };

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if($state.current.title){
                $scope.page.meta.title = $state.current.title;
                $scope.page.meta.description = $state.current.description;
                $scope.page.meta.keywords = $state.current.keywords;
            }
        });
    }
]);
