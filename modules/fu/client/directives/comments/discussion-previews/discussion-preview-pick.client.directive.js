'use strict';

angular.module('fu').directive('discussionPreviewPick', function () {
    return {
        restrict: 'E',
        scope: {
            preview: '='
        },
        templateUrl: 'modules/fu/client/templates/comments/discussion-previews/discussion-preview-pick.client.template.html',
        controller: ['$scope', '$filter', '$sce', function ($scope, $filter, $sce){
            $scope.category = $scope.preview.league.name;
            $scope.eventSlug = $scope.preview.event.slug;
            $scope.leagueSlug = $scope.preview.league.slug;
            $scope.title = $filter('betName')($scope.preview.pick, $scope.preview.event);
            $scope.commentCount = $scope.preview.pick.commentCount;
            $scope.commentPreview = $sce.trustAsHtml($filter('limitTo')($filter('striptags')($scope.preview.text),50));
        }]
    };
});