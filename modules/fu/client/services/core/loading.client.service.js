'use strict';

angular.module('fu').factory('Loading',
    function() {

        var isLoading = {
            pickSubmit: false,
            pageLoading: false
        };

        return{
            isLoading: isLoading
        };
    }
);
