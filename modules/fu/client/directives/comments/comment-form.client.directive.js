'use strict';

angular.module('fu').directive('commentForm', function() {
    return {
        restrict: 'E',
        scope: {
            text: '='
        },
        templateUrl: 'modules/fu/client/templates/comments/comment-form.client.template.html',
        controller: ['$scope',  function($scope) {
            $scope.toolbarOptions = [
                ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                ['insertImage','insertLink', 'insertVideo']
            ];
        }]
    };
});