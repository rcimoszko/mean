'use strict';

angular.module('fu').controller('TopMenuController', ['$scope', '$state', 'Authentication', 'Search', '$http', '$rootScope', '$location', 'Modal', 'User',
    function ($scope, $state, Authentication, Search, $http, $rootScope, $location, Modal, User) {
        $scope.authentication = Authentication;
        $scope.state = $state;
        $scope.location = $location;
        $scope.user = User;
        $scope.searchLoading = false;

        $scope.getResults = function() {
            return $http.get('/api/search', {
                params: {
                    text: $scope.searchText
                }
            }).then(function(response){
                return response.data;
            });
        };

        var excludeRedirect = ['/login', '/', '/blog'];
        $scope.signupUrl = function(){
            if(excludeRedirect.indexOf($scope.location.path()) !== -1) return '/signup';
            return '/signup?redirect='+$scope.location.path();
        };

        $scope.toggleSideMenu = function(){
            $rootScope.$emit('toggleSideMenu');
        };

        $scope.searchSelected = function($model){
            switch($model.type){
                case 'event':
                    $state.go('gamecenter', {eventSlug: $model.slug, leagueSlug: $model.leagueSlug});
                    break;
                case 'channel':
                    $state.go('channel.main.home', {channelSlug: $model.slug});
                    break;
                case 'user':
                    $state.go('profile', {username: $model.name});
                    break;
            }
        };


        $scope.isCollapsed = false;
        $scope.toggleCollapsibleMenu = function () {
            $scope.isCollapsed = !$scope.isCollapsed;
        };

        $scope.$on('$stateChangeSuccess', function () {
            $scope.isCollapsed = false;
        });

        $scope.showTrialModal = function(){
            Modal.showModal(
                'modules/fu/client/views/trial/modal/modal-trial.client.view.html',
                'ModalTrialController',
                null
            );
        };

    }
]);
