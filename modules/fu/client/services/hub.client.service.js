'use strict';

angular.module('fu').factory('Hub', ['ApiHub',
    function(ApiHub) {

        var getHub = function(callback){
            function cbSuccess(hub){
                callback(null, hub);
            }

            function cbError(response){
                callback(response.data.message);
            }
            ApiHub.get({}, cbSuccess, cbError);
        };


        return {
            getHub: getHub
        };
    }
]);