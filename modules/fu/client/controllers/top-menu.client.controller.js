'use strict';

angular.module('fu').controller('TopMenuController', ['$scope', '$state', 'Authentication', 'Search', '$http',
    function ($scope, $state, Authentication, Search, $http) {
        $scope.authentication = Authentication;
        $scope.state = $state;
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
            console.log($model);
        };

    }
]);
