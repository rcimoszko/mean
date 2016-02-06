'use strict';

angular.module('fu').controller('SettingsController', ['$scope', '$http', '$location', '$state', 'Users', 'Authentication', 'Sports', 'StripeService', 'Page', 'Modal',
    function($scope, $http, $location, $state, Users, Authentication, Sports, StripeService, Page, Modal) {
        $scope.user = Authentication.user;
        $scope.stripe = StripeService;
        Page.setTitle($scope.user.username+' Settings | FansUnite');
        Page.setDescription($scope.user.username+' settings.');

        // If user is not signed in then redirect back home
        if (!$scope.user) $state.go('home');

        // Check if there are additional accounts
        $scope.hasConnectedAdditionalSocialAccounts = function(provider) {
            for (var i in $scope.user.additionalProvidersData) {
                return true;
            }
            return false;
        };
        // Check if provider is already in use with current user
        $scope.isConnectedSocialAccount = function(provider) {
            return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
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
                $scope.user = Authentication.user = response;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        // Update a user profile
        $scope.updateUserProfile = function() {
            $scope.success = $scope.error = null;
            delete $scope.user.profileUrl; // controlled by upload-image-url directive
            delete $scope.user.avatarUrl; // controlled by upload-image-url directive
            var user = new Users($scope.user);

            user.$update(function(response) {
                $scope.success = 'Profile Saved Successfully';
                Authentication.user = response;
                console.log(response);
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
                    $scope.user = response.user;
                }
            });
        };

        $scope.resumeSubscription = function(){
            $scope.stripe.resumeSubscription(function(response){
                if(response.type === 'error'){
                    $scope.error = response.message;
                } else if (response.type === 'success'){
                    $scope.success = 'Your subscription has been renewed.';
                    $scope.user = response.user;
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