'use strict';

angular.module('fu').factory('StripeService', ['$resource', '$state', 'Authentication', '$http', 'Modal', 'User',
    function($resource, $state, Authentication, $http, Modal, User) {

        //var key = 'pk_live_73Q2l4S0RJOJ2jKXtmBOeH45';
        var key = 'pk_test_AkvAU2W7WvoGI5ehchaxF7sM';
        var image ='/modules/fu/client/img/stripe/fansunite-logo-square.png';


        //stripe resource
        var stripe = $resource('/pro/new', {
            save: {
                method:'POST',
                params:{stripeToken: '@_stripeToken', plan: '@_plan'}
            }
        });


        //Plan ID - Pro, 6month, 1year
        /*
        var new1MonthSubscription = function(callback){
            newSubscription('Pro', '30 day subscription - Auto Renew', 2000,  callback);
        };

        var new6MonthSubscription = function(callback){
            newSubscription('6month', '6 month subscription - Auto Renew', 10000, callback);

        };

        var new12MonthSubscription = function(callback){
            newSubscription('1year', '1 year subscription - Auto Renew', 18000, callback);
        };
        */


        var newBaseSubscription = function(callback){
            newSubscription('Base Subscription', '30 day subscription - Auto Renew', 1000,  callback);
        };

        var newPremium1Subscription = function(callback){
            newSubscription('1 Month Premium', '30 day subscription - Auto Renew', 5000,  callback);
        };

        var newPremium6Subscription = function(callback){
            newSubscription('6 Months Premium', '6 month subscription - Auto Renew', 25000,  callback);
        };



        var newSubscription = function(plan, description, amount, callback){
            var handler = StripeCheckout.configure({
                key: key,
                image: image,
                token: function(stripeToken) {
                    stripe.save({stripeToken: stripeToken.id, plan: plan},
                        //success
                        function(user) {
                            Authentication.user = user;
                            User.updateUserStatus();
                            callback(null);
                        },
                        //error
                        function(data){
                            callback(data);
                        });
                }
            });

            var name;
            switch(plan){
                case 'Base Subscription':
                    name = 'FansUnite Base';
                    break;
                case '1 Month Premium':
                    name = 'FansUnite Pro';
                    break;
                case '6 Months Premium':
                    name = 'FansUnite Pro';
                    break;
            }

            handler.open({
                name: name,
                description: description,
                amount: amount
            });
        };



        var resumeSubscription =  function(callback){
            if (confirm('Are you sure you want to renew your Pro subscription?')) {
                $http({method: 'GET', url: '/pro/resume'}).
                    success(function(user) {
                        Authentication.user = user;
                        User.updateUserStatus();
                        callback(null);
                    }).
                    error(function (data) {
                        callback(data.message);
                    });
            }
        };

        var cancelSubscription = function(callback){
            if (confirm('Are you sure you want to cancel your subscription?')) {
                $http({method: 'GET', url: '/pro/cancel'}).
                    success(function (user, status) {
                        console.log(user);
                        Authentication.user = user;
                        User.updateUserStatus();
                        callback(null);
                    }).
                    error(function (data, status) {
                        callback(data.message);
                    });
            }
        };


        var changeSubscription = function(plan, callback){
            if (confirm('Are you sure you want to upgrade to subscription?')) {
                $http({method: 'POST', url: '/pro/change', data: {plan:plan}}).
                    success(function (user, status) {
                        Authentication.user = user;
                        User.updateUserStatus();
                        callback(null);
                    }).
                    error(function (data, status) {
                        callback(data.message);
                    });
            }
        };

        var showSubscriptionModal = function(){
            if(Authentication.user){
                Modal.showModal(
                    'modules/fu/client/views/subscription/modal/modal-subscription.client.view.html',
                    'ModalSubscriptionController',
                    null,
                    'stripe'
                );
            } else {
                $state.go('signup');
            }
        };


        return {
            newSubscription: newSubscription,
            cancelSubscription: cancelSubscription,
            resumeSubscription: resumeSubscription,
            changeSubscription: changeSubscription,

            newBaseSubscription: newBaseSubscription,
            newPremium1Subscription: newPremium1Subscription,
            newPremium6Subscription: newPremium6Subscription,

            showSubscriptionModal: showSubscriptionModal
        };

    }
]);