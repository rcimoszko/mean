'use strict';

angular.module('fu').factory('GaEcommerce', [
    function() {

        function sendTransaction(id, plan, amount){
            ga('ecommerce:addTransaction', {
                'id': id,
                'affiliation': plan,
                'revenue': amount
            });
            ga('ecommerce:send');
            console.log(id, plan, amount);
            console.log('sent');
        }

        return {
            sendTransaction:   sendTransaction
        };
    }
]);