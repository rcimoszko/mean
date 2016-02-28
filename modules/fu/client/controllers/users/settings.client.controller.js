'use strict';

angular.module('fu').controller('SettingsController', ['$scope', '$http', '$location', '$state', 'Users', 'Authentication', 'Sports', 'StripeService', 'Page', 'Modal', 'User',
    function($scope, $http, $location, $state, Users, Authentication, Sports, StripeService, Page, Modal, User) {
        $scope.authentication = Authentication;
        $scope.stripe = StripeService;
        $scope.user = User;
        Page.meta.title = $scope.authentication.user.username+' Settings | FansUnite';
        Page.meta.description = $scope.authentication.user.username+' settings.';

        // If user is not signed in then redirect back home
        if (!$scope.authentication.user) $state.go('home');

        // Check if there are additional accounts
        $scope.hasConnectedAdditionalSocialAccounts = function(provider) {
            for (var i in $scope.authentication.user.additionalProvidersData) {
                return true;
            }
            return false;
        };
        // Check if provider is already in use with current user
        $scope.isConnectedSocialAccount = function(provider) {
            return $scope.authentication.user.provider === provider || ($scope.authentication.user.additionalProvidersData && $scope.authentication.user.additionalProvidersData[provider]);
        };

        // Remove a user social account
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

        // Update a user profile
        $scope.updateUserProfile = function() {
            $scope.success = $scope.error = null;
            delete $scope.authentication.user.profileUrl; // controlled by upload-image-url directive
            delete $scope.authentication.user.avatarUrl; // controlled by upload-image-url directive
            var user = new Users($scope.authentication.user);

            user.$update(function(response) {
                $scope.success = 'Profile Saved Successfully';
                Authentication.user = response;
            }, function(response) {
                $scope.error = response.data.message;
            });
        };

        // Change user password
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
            $scope.stripe.cancelSubscription(function(response){
                if(response.type === 'error'){
                    $scope.error = response.message;
                } else if (response.type === 'success'){
                    $scope.success = 'Your subscription has been cancelled.';
                    $scope.authentication.user = response.user;
                }
            });
        };

        $scope.resumeSubscription = function(){
            $scope.stripe.resumeSubscription(function(response){
                if(response.type === 'error'){
                    $scope.error = response.message;
                } else if (response.type === 'success'){
                    $scope.success = 'Your subscription has been renewed.';
                    $scope.authentication.user = response.user;
                }
            });
        };


        $scope.oddsFormats = ['Decimal', 'American', 'Fractional'];
        Sports.getAll(function(err, sports){
            $scope.sports = sports;
        });
        $scope.profileImage = '../../modules/users/img/signup/profile.png';

    }
]);