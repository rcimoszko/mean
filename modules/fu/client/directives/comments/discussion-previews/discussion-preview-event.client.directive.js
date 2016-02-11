'use strict';

angular.module('fu').directive('discussionPreviewEvent', function () {
    return {
        restrict: 'E',
        scope: {
            preview: '='
        },
        templateUrl: 'modules/fu/client/templates/comments/discussion-previews/discussion-preview-event.client.template.html',
        controller: ['$scope', '$filter', '$sce', function ($scope, $filter, $sce){
            $scope.category = $scope.preview.league.name;
            $scope.slug = $scope.preview.event.slug;
            $scope.title = $filter('teamNameHeader')($scope.preview.event);
            $scope.commentCount = $scope.preview.event.commentCount;
            $scope.commentPreview = $sce.trustAsHtml($filter('limitTo')($filter('striptags')($scope.preview.text),50));
        }]
    };
});