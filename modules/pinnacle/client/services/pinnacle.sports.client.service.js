'use strict';

angular.module('pinnacle').factory('PinnacleSports', ['ApiPinnacleSports',
    function(ApiPinnacleSports) {

        var getAll = function(callback){

            function cbSuccess(pinnacleSports){
                callback(null, pinnacleSports);
            }

            function cbError(err){
                callback(err);
            }

            ApiPinnacleSports.query(cbSuccess, cbError);
        };

        var update = function(callback){

        };


        return {
            getAll: getAll,
            update: update
        };

    }
]);