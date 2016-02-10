'use strict';

angular.module('fu').directive('discussionPreviewPick', function () {
    return {
        restrict: 'E',
        scope: {
            preview: '='
        },
        templateUrl: 'modules/fu/client/templates/comments/discussion-previews/discussion-preview-pick.client.template.html',
        controller: ['$scope', '$filter', function ($scope, $filter){
            $scope.category = $scope.preview.league.name;
            $scope.slug = $scope.preview.event.slug;
            $scope.title = $filter('betName')($scope.preview.pick, $scope.preview.event);
            $scope.commentCount = $scope.preview.pick.commentCount;
            $scope.commentPreview = $filter('limitTo')($filter('striptags')($scope.preview.text),50);
        }]
    };
});