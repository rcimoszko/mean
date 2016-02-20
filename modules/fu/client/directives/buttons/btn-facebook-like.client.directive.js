'use strict';

angular.module('fu').directive('btnFacebookLike', function () {
    return {
        restrict: 'E',
        scope: {
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-facebook-like.client.template.html'
    };
});