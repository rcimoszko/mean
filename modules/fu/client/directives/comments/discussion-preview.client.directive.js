'use strict';

angular.module('fu').directive('discussionPreview', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            preview: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {

            var directive;

            if($scope.preview.pick){
                directive = '<discussion-preview-pick preview="preview"></discussion-preview-pick>';
            } else if($scope.preview.event){

                directive = '<discussion-preview-event preview="preview"></discussion-preview-event>';
            }

            var el = $compile(directive)($scope);
            $element.append(el);

        }]
    };
});
