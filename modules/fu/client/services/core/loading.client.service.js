'use strict';

angular.module('fu').factory('Loading',
    function() {

        var isLoading = {
            pickSubmit: false
        };

        return{
            isLoading: isLoading
        };
    }
);
