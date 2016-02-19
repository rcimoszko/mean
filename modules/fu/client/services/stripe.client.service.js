'use strict';

angular.module('fu').factory('StripeService', ['$resource', '$state', 'Authentication', '$http', 'Modal',
    function($resource, $state, Authentication, $http, Modal) {

        var key = 'pk_live_73Q2l4S0RJOJ2jKXtmBOeH45';
        var image ='/modules/fu/client/img/stripe/fansunite-logo-square.png';


        //stripe resource
        var stripe = $resource('/pro/new', {
            save: {
                method:'POST',
                params:{stripeToken: '@_stripeToken', plan: '@_plan'}
            }
        });


        //Plan ID - Pro, 6month, 1year

        var new1MonthSubscription = function(callback){
            newSubscription('Pro', '30 day subscription - Auto Renew', 2000,  callback);
        };

        var new6MonthSubscription = function(callback){
            newSubscription('6month', '6 month subscription - Auto Renew', 10000, callback);

        };

        var new12MonthSubscription = function(callback){
            newSubscription('1year', '1 year subscription - Auto Renew', 18000, callback);
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
                            callback({type: 'success', user: user});
                        },
                        //error
                        function(data){
                            callback({type: 'error', message: data.message});
                        });
                }
            });

            handler.open({
                name: 'FansUnite Pro',
                description: description,
                amount: amount
            });
        };


        /*
         var newSubscription = function (callback){
         var handler = StripeCheckout.configure({
         key: key,
         image: image,
         token: function(stripeToken) {
         stripe.save({stripeToken: stripeToken.id},
         //success
         function(user) {
         Authentication.user = user;
         callback({type: 'success', user: user});
         },
         //error
         function(data){
         callback({type: 'error', message: data.message});
         });
         }
         });

         handler.open({
         name: 'FansUnite Pro',
         description: '30 day subscription - Auto Renew',
         amount: 2000
         });
         };
         */

        var resumeSubscription =  function(callback){
            if (confirm('Are you sure you want to renew your pro subscription?')) {
                $http({method: 'GET', url: '/pro/resume'}).
                    success(function(user) {
                        Authentication.user = user;
                        callback({type: 'success', user: user});
                    }).
                    error(function (data) {
                        callback({type: 'error', message: data.message});
                    });
            }
        };

        var cancelSubscription = function(callback){
            if (confirm('Are you sure you want to cancel your pro subscription?')) {
                $http({method: 'GET', url: '/pro/cancel'}).
                    success(function (user, status) {
                        Authentication.user = user;
                        callback({type: 'success', user:user});
                    }).
                    error(function (data, status) {
                        callback({type:'error', message: data.message});
                    });
            }
        };

        var showSubscriptionModal = function(){
            if(Authentication.user){
                Modal.showModal(
                    'modules/fu/client/views/stripe/modal/modal-stripe.client.view.html',
                    'ModalStripeController',
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

            new1MonthSubscription: new1MonthSubscription,
            new6MonthSubscription: new6MonthSubscription,
            new12MonthSubscription : new12MonthSubscription,
            showSubscriptionModal: showSubscriptionModal
        };

    }
]);