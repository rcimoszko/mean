'use strict';

angular.module('fu').filter('striptags', function() {
        return function(text) {
            return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    }
);