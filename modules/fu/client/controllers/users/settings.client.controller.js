'use strict';

angular.module('fu').controller('SettingsController', ['$scope', '$http', '$location', '$state', 'Users', 'Authentication', 'Sports', 'StripeService', 'Page', 'Modal', 'User', 'ApiUsers',
    function($scope, $http, $location, $state, Users, Authentication, Sports, StripeService, Page, Modal, User, ApiUsers) {
        $scope.authentication = Authentication;
        $scope.stripe = StripeService;
        $scope.user = User;
        Page.meta.title = $scope.authentication.user.username+' Settings | FansUnite';
        Page.meta.description = $scope.authentication.user.username+' settings.';

        if (!$scope.authentication.user) $state.go('home');

        $scope.hasConnectedAdditionalSocialAccounts = function(provider) {
            for (var i in $scope.authentication.user.additionalProvidersData) {
                return true;
            }
            return false;
        };

        $scope.isConnectedSocialAccount = function(provider) {
            return $scope.authentication.user.provider === provider || ($scope.authentication.user.additionalProvidersData && $scope.authentication.user.additionalProvidersData[provider]);
        };

        $scope.removeUserSocialAccount = function(provider) {
            $scope.success = $scope.error = null;

            $http.delete('/api/users/accounts', {
                params: {
                    provider: provider
                }
            }).success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.authentication.user = Authentication.user = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.updateUserProfile = function() {
            $scope.success = $scope.error = null;
            delete $scope.authentication.user.profileUrl; // controlled by upload-image-url directive
            delete $scope.authentication.user.avatarUrl; // controlled by upload-image-url directive
            var user = new ApiUsers($scope.authentication.user);

            user.$update(function(response) {
                $scope.success = 'Profile Saved Successfully';
                Authentication.user = response;
            }, function(response) {
                $scope.error = response.data.message;
            });
        };

        $scope.changeUserPassword = function() {
            $scope.success = $scope.error = null;

            $http.post('/api/users/password', $scope.passwordDetails).success(function(response) {
                // If successful show success message and clear form
                $scope.success = 'Profile Saved Successfully';
                $scope.passwordDetails = null;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.newSubscription = function(){
            Modal.showModal('/modules/core/views/subscription-modal.client.view.html', 'SubscriptionModalController', null);

        };

        $scope.cancelSubscription = function(){
            $scope.stripe.cancelSubscription(function(err){
                if(err){
                    $scope.error = err;
                } else {
                    $scope.success = 'Your subscription has been cancelled.';
                }
            });
        };

        $scope.resumeSubscription = function(){
            $scope.stripe.resumeSubscription(function(err){
                if(err){
                    $scope.error = err;
                } else {
                    $scope.success = 'Your subscription has been renewed.';
                }
            });
        };


        $scope.oddsFormats = ['Decimal', 'American', 'Fractional'];
        Sports.getAll(function(err, sports){
            $scope.sports = sports;
        });
        $scope.profileImage = '../../modules/users/img/signup/profile.png';


        /**
         * Notifications
         */

        function cb(err, followingSettings){
            console.log(followingSettings);
            if(!err) $scope.followingSettings = followingSettings;
        }

        User.getFollowingSettings(cb);


        $scope.toggleFollowingSettings = function(followingSettings){
            followingSettings.$update();
        };

    }
]);