'use strict';

angular.module('fu').factory('Search', ['ApiSearch',
    function(ApiSearch) {

        var search = function(text, callback){
            function cbSuccess(results){
                callback(null, results);
            }

            function cbError(response){
                callback(response.data.message);
            }

            ApiSearch.query({text:text}, cbSuccess, cbError);
        };

        return {
            search: search
        };
    }
]);