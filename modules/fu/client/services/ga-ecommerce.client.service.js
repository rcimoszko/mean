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
        }

        return {
            sendTransaction:   sendTransaction
        };
    }
]);