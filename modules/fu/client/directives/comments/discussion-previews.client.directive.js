'use strict';

angular.module('core').directive('discussionPreviews', function(){
    return {
        restrict: 'E',
        scope: {
            previews: '='
        },
        templateUrl: '/modules/fu/client/templates/comments/discussion-previews.client.template.html',
        controller: ['$scope', function($scope){


        }]
    };
});


