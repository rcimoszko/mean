'use strict';

angular.module('fu').factory('GaEcommerce', [
    function() {

        function sendTransaction(id, plan, amount){
            ga('ecommerce:addTransaction', {
                'id': id,
                'affiliation': 'FansUnite Pro Subscription',
                'revenue': amount
            });
            ga('ecommerce:addItem', {
                'id': id,
                'name': plan,
                'price': amount
            });

            ga('ecommerce:send');
            console.log(id, plan, amount);g
            console.log('sent');
        }

        return {
            sendTransaction:   sendTransaction
        };
    }
]);